import { Router } from 'express';
const router = Router();
import { User, Post, Category, Comment, PostLike } from '../../model.js';
import { Op } from 'sequelize';
import { passLoggedIn, passAdmin, isAdminLoggedIn, getUserId } from '../../utils/passUsers.js';
const pageSize = 10;

// TODO - pagination done
router.get('/', async (req, res) => {
    try {
        let page = req.query?.page;
        let sort = req.query?.sort;
        let category = req.query?.category;
        let showInactive = req.query?.showInactive;
        let searchByTitle = req.query?.searchByTitle;
        await getUserId(req);
        if (!isAdminLoggedIn(req)) {
            showInactive = false;
        }
        let maxDate = req.query?.maxDate;
        let minDate = req.query?.minDate;
        
        let opts = {
            include: [Category, { model: User, as: 'author' }]
        }
        if (sort) {
            if (sort.toLowerCase() == 'date') {
                opts = {
                    ...opts,
                    order: [
                        ['publishDate', 'DESC']
                    ]
                };
            }
        }

        if (searchByTitle) {
            opts = {
                ...opts,
                where: {
                    ...opts.where,
                    title: {
                        [Op.substring]: searchByTitle.trim()
                    }
                }
            }
        }

        if (showInactive == false) {
            opts = {
                ...opts,
                where: {
                    ...opts.where,
                    status: 'active'
                }
            }
        }
        if (maxDate) {
            opts.where = {
                ...opts.where,
                publishDate: {
                    ...opts.where.publishDate,
                    [Op.lte]: maxDate
                }
            }
        }
        if (minDate) {
            opts.where = {
                ...opts.where,
                publishDate: {
                    ...opts.where.publishDate,
                    [Op.gte]: minDate
                }
            }
        }
        if (category) {
            category = [...category];
            opts.include = [...opts.include, {
                model: Category,
                where: {
                    id: {
                        [Op.in]: category
                    }
                }
            }]
        }
        let unpagedOpts = opts
        if (page) {
            opts = {
                ...opts,
                offset: pageSize * (page - 1),
                limit: pageSize
            }
        }
        let count = await Post.count(unpagedOpts);
        let pages = Math.ceil(count / pageSize);
        let posts = await Post.findAll(opts);
        for (const post of posts) {
            post.dataValues.rating = await post.getRating();
            delete post.dataValues.likes;
            delete post.dataValues.categories;
        }
        if (sort) {
            if (sort.toLowerCase() == 'rating') {
                posts = posts.sort((a, b) => b.dataValues.rating - a.dataValues.rating);
            }
        }
        else {
            posts = posts.sort((a, b) => b.dataValues.rating - a.dataValues.rating);
        }

        return res.json({ posts, pages });
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let opts = {
            include: [{ model: User, as: 'author' }, Category, { model: Comment, include: { model: User, as: 'author' } }]
        };
        if (!isAdminLoggedIn(req)) {
            opts = {
                ...opts,
                where: {
                    status: 'active'
                }
            }
        }
        let post = await Post.findByPk(Number(id), opts);
        if (!post) return res.sendStatus(404);
        post.dataValues.rating = await post.getRating();
        for (const comment of post.comments) {
            comment.dataValues.rating = await comment.getRating()
        }
        post.comments.sort((a, b) => b.dataValues.rating - a.dataValues.rating);
        return res.json(post);
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});


router.get('/:id/comments', async (req, res) => {
    try {
        let id = req.params.id;
        let post = await Post.findByPk(Number(id), {
            include: {
                model: Comment,
                include: { model: User, as: 'author' },
                order: [
                    ['publishDate', 'DESC']
                ]
            }
        });
        if (!post) return res.sendStatus(404);
        for (const comment of post.comments) {
            comment.dataValues.rating = await comment.getRating()
        }
        post.comments.sort((a, b) => b.dataValues.rating - a.dataValues.rating);
        let comments = post.comments;
        return res.json({ comments });

    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.post('/:id/comment', passLoggedIn, async (req, res) => {
    try {
        let params = req.body;
        if (!params.content) return res.sendStatus(400);
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(403);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        if (!post) return res.sendStatus(404);
        let newComment = await Comment.create({
            content: params.content
        });
        await newComment.setPost(post);
        await newComment.setAuthor(user);
        await newComment.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get('/:id/categories', async (req, res) => {
    try {
        let id = req.params.id;
        let post = await Post.findByPk(Number(id), {
            include: Category
        });
        if (!post) return res.sendStatus(404);
        let categories = post.categories;
        return res.json({ categories });

    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.get('/:id/like', async (req, res) => {
    try {
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        if (!post) return res.sendStatus(404);
        let likes = await post.countLikes({
            where: {
                isDislike: false
            }
        });
        let dislikes = await post.countLikes({
            where: {
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

router.get('/:id/isLiked', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(401);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        if (!post) return res.sendStatus(404);
        let testLike = await post.getLikes({
            where: {
                authorId: user.id
            }
        });
        //console.log(testLike);
        if (testLike.length > 0) return res.json({ isLiked: true, isDislike: testLike[0].isDislike });
        else return res.json({ isLiked: false, isDislike: null });

    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.post('/', passLoggedIn, async (req, res) => {
    try {
        let params = req.body;
        if (!params.content || !params.title || !params.categories) return res.sendStatus(400);
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(403);
        let post = await Post.create({
            title: params.title,
            content: params.content,
            author: user,
            type: params.type || 'plain'
        });
        await post.setAuthor(user);
        for (const category of params.categories) {
            let cat = await Category.findByPk(category);
            if (!cat) continue;
            await post.addCategory(cat);
            await cat.save();
        }
        await post.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.post('/:id/like', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(401);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        if (!post) return res.sendStatus(404);
        let testLike = await post.getLikes({
            where: {
                authorId: user.id
            }
        });
        if (testLike.length > 0) return res.sendStatus(202);

        let like = PostLike.build();
        if (req.body?.dislike) {
            like.isDislike = true;
        }
        await like.setAuthor(user, { save: false });
        await like.setPost(post, { save: false })
        await like.save();
        await user.save();
        await post.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.patch('/:id', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id), { include: { model: User, as: 'author' } });
        let postAuthor = post.author;
        if (!post) return res.sendStatus(404);
        if (user.id != postAuthor.id && req.body.content) {
            return res.sendStatus(403);
        }
        let params = req.body;
        if (params.content) post.content = params.content.trim();
        if (params.title) post.title = params.title.trim();
        if (params.categories) {
            await post.setCategories([]);
            for (const category of params.categories) {
                let cat = await Category.findByPk(category);
                if (!cat) continue;
                await post.addCategory(cat);
                await cat.save();
            }
        }
        if (params.status) {
            if (params.status == 'active') post.status = 'active';
            if (params.status == 'inactive') post.status = 'inactive';
        }
        await post.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.delete('/:id', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        let postAuthor = await post.getAuthor();
        if (!post) return res.sendStatus(404);
        if (user.id != postAuthor.id && user.role != 'Admin') {
            return res.sendStatus(403);
        }
        await post.destroy();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.delete('/:id/like', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        if (!post) return res.sendStatus(404);
        let postLikes = await post.getLikes({
            where: {
                authorId: user.id
            }
        });
        
        if (postLikes.length > 0) {
            for (const l of postLikes) {
                await l.destroy()
            }
        }
        await post.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.post('/:id/favourite', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(403);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        if (!post) return res.sendStatus(404);

        try {
            await user.addFavourite(post);
        } catch (err) {
            return res.sendStatus(202);
        }

        await user.save();
        await post.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get('/:id/isFavourite', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(403);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        if (!post) return res.sendStatus(404);

        let isFav = await user.hasFavourite(post);
        //console.log(isFav);
        if (isFav)
            return res.sendStatus(200);
        else return res.sendStatus(404);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.delete('/:id/favourite', passLoggedIn, async (req, res) => {
    try {
        let user = await User.findByPk(req.userId);
        if (!user) return res.sendStatus(403);
        let id = req.params.id;
        let post = await Post.findByPk(Number(id));
        if (!post) return res.sendStatus(404);

        try {
            await user.removeFavourite(post);
        } catch (err) {
            return res.sendStatus(202);
        }

        await user.save();
        await post.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

export default router;
