import { Router } from 'express';
const router = Router();
import { User, Post } from '../../model.js';
import sanitize from "sanitize-filename";
import { hashPassword, comparePassword } from '../../utils/hash.js';
import path from 'path';

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const profile_picturePath = __dirname + '/../../resources/profile_pictures/';



import { passLoggedIn, passAdmin, isAdminLoggedIn, getUserId } from '../../utils/passUsers.js';

router.get('/', passAdmin , async (req, res) => {
    try {
        let users = await User.findAll();
        for (const user of users) {
            user.dataValues.rating = await user.getRating();
            delete user.dataValues.password;
        }
        return res.json({users});
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.get('/me', passLoggedIn, async (req, res) => {
    try {
        let id = req.userId;
        let user = await User.findByPk(Number(id));
        if (!user) return res.sendStatus(404);
        user.dataValues.rating = await user.getRating();
        delete user.dataValues.password;
        return res.json(user);
    } catch (err) {
        console.log(err)
        return res.sendStatus(404);
    }
});

router.get('/:id', passLoggedIn , async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByPk(Number(id));
        if (!user) return res.sendStatus(404);
        if (!isAdminLoggedIn(req) && !user.active) return res.sendStatus(403);
        user.dataValues.rating = await user.getRating();
        delete user.dataValues.password;
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.get('/me/posts', passLoggedIn , async (req, res) => {
    try {
        let id = req.userId;
        let user = await User.findByPk(Number(id), {include:Post});
        if (!user) return res.sendStatus(404);
        let posts = user.posts;
        for (const post of posts) {
            post.dataValues.rating = await post.getRating();
        }
        return res.json({posts});
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.get('/me/favourites', passLoggedIn , async (req, res) => {
    try {
        let id = req.userId;
        let user = await User.findByPk(Number(id), {include:{model:Post, as:'favourites'}});
        if (!user) return res.sendStatus(404);
        let posts = user.favourites;
        for (const post of posts) {
            post.dataValues.rating = await post.getRating();
        }
        return res.json({posts});
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});


router.get('/:id/posts', passLoggedIn , async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByPk(Number(id), {include:{model: Post, where:{status:'active'}}});
        if (!user) return res.sendStatus(404);
        let posts = user.posts;
        for (const post of posts) {
            post.dataValues.rating = await post.getRating();
        }
        return res.json({posts});
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.get('/:id/favourites', passLoggedIn , async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByPk(Number(id), {include:{model:Post, as:'favourites'}});
        if (!user) return res.sendStatus(404);
        let posts = user.favourites;
        for (const post of posts) {
            post.dataValues.rating = await post.getRating();
        }
        return res.json({posts});
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

router.get('/:id/avathar',  async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByPk(Number(id));
        if (!user) return res.sendStatus(404);
        if (!user.profilePicture) return res.sendStatus(404);
        if (user.profilePicture.trim() == '') return res.sendStatus(404);
        
        return res.sendFile(path.resolve(profile_picturePath + user.profilePicture));
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});



router.post('/', passAdmin, async (req, res) => {
    let params = req.body;
    if (!params.login || !params.password
        || !params.password_confirm || !params.email
        || !params.fullName || !params.role) {
        return res.sendStatus(400);
    }
    if (params.password != params.password_confirm) return res.sendStatus(403);
    try {
        let user = await User.create({
            login: params.login.trim(),
            password: hashPassword(params.password.trim()),
            email: params.email.trim(),
            fullName: params.fullName.trim(),
            role: params.role.trim(),
            active: true
        });
        if (req.files?.profile_picture) {
            let file = req.files.profile_picture;
            let path = profile_picturePath + sanitize(params.login) + file.name;
            await file.mv(path);
            user.profilePicture = sanitize(params.login) + file.name;
            await user.save();
            return res.sendStatus(200);
        }
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.patch('/avathar', passLoggedIn, async (req, res) => {
    try {
        if (!req.files?.profile_picture) return res.sendStatus(400);
        let dbUser = await User.findByPk(req.userId);
        
        let file = req.files?.profile_picture;
        let path = profile_picturePath + sanitize(dbUser.login) + file.name;
        await file.mv(path);
        dbUser.profilePicture = sanitize(dbUser.login) + file.name;
        await dbUser.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.patch('/:id', passAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByPk(Number(id));
        if (!user) return res.sendStatus(404);
        let params = req.body;
        if (params.login) user.login = params.login.trim();
        if (params.fullName) user.fullName = params.fullName.trim();
        if (params.password) user.password = hashPassword(params.password.trim());
        if (params.email) user.email = params.email;
        if (params.role) user.role = params.role;
        if (params.active) user.active = params.active;
        await user.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
});

router.delete('/:id', passAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findByPk(Number(id));
        if (!user) return res.sendStatus(404);
        await user.destroy();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

export default router;
