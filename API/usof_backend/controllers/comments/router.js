import { Router } from 'express';
const router = Router();
import { User, Post, Category, Comment, CommentLike} from '../../model.js';
import sanitize from "sanitize-filename";
import { passLoggedIn, passAdmin } from '../../utils/passUsers.js';


router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let comment = await Comment.findByPk(Number(id), {
            include:{model:User, as:'author'}
        });
        if (!comment) return res.sendStatus(404);
        return res.json(comment);
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.get('/:id/like', async (req, res) => {
    try {
        let id = req.params.id;
        let comment = await Comment.findByPk(Number(id));
        if (!comment) return res.sendStatus(404);
        let likes = await comment.countLikes({
            where:{
                isDislike: false
            }
        });
        let dislikes = await comment.countLikes({
            where:{
                isDislike: true
            }
        });
        return res.json({
            likes,
            dislikes,
            rating: likes - dislikes
        })
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.post('/:id/like', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(403);
        let id = req.params.id;
        let comment = await Comment.findByPk(Number(id));
        if (!comment) return res.sendStatus(404);
        let testLike = await comment.getLikes({
            where: {
                authorId: user.id
            }
        });
        if (testLike.length > 0) return res.sendStatus(202);
        let like = CommentLike.build();
        if (req.body?.dislike) {
            like.isDislike = true;
        }
        await like.setComment(comment, {save: false});
        await like.setAuthor(user, {save: false});
        await like.save();
        await user.save();
        await comment.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get('/:id/isLiked', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(401);
        let id = req.params.id;
        let comment = await Comment.findByPk(Number(id));
        if (!comment) return res.sendStatus(404);
        let testLike = await comment.getLikes({
            where: {
                authorId: user.id
            }
        });
        if (testLike.length > 0) return res.json({ isLiked: true, isDislike: testLike[0].isDislike });
        else return res.json({ isLiked: false, isDislike: null });
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.patch('/:id', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        let id = req.params.id;
        let comment = await Comment.findByPk(Number(id), { include: {model: User, as: 'author'} });
        if (!comment) return res.sendStatus(404);
        let commentUser = comment.author;
        if (user.id != commentUser.id && user.role != 'Admin') {
            return res.sendStatus(403);
        }
        let params = req.body;
        if (params.content) comment.content = params.content.trim();
        await comment.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.delete('/:id', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(401);
        let id = req.params.id;
        let comment = await Comment.findByPk(Number(id), {include:{model: User, as:'author'}});
        if (!comment) return res.sendStatus(404);
        let commentAuthor = comment.author;
        if (user.id != commentAuthor.id && user.role != 'Admin') {
            return res.sendStatus(403);
        }
        await comment.destroy();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.delete('/:id/like', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(401);
        let id = req.params.id;
        let comment = await Comment.findByPk(Number(id));
        if (!comment) return res.sendStatus(404);
        let commentLikes = await comment.getLikes({
            where: {
                authorId: user.id
            }
        });
        if (commentLikes.length > 0) {
            for (const l of commentLikes) {
                await l.destroy();
            }
        }
        await comment.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

export default router;
