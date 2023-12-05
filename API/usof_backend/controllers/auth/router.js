import { Router } from 'express';
const router = Router();
import { User, Post, Category, Comment } from '../../model.js';
import { createTransport } from 'nodemailer';
import sanitize from "sanitize-filename";
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../utils/jwtHelper.js';

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


// eslint-disable-next-line no-undef
const email_address = process.env.EMAIL_LOGIN;
// eslint-disable-next-line no-undef
const email_password = process.env.EMAIL_PASSWORD;
const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: email_address,
        pass: email_password
    }
});

const profile_picturePath = __dirname + '/../../resources/profile_pictures/';

import { hashPassword, comparePassword } from '../../utils/hash.js';

//REDO
router.post('/register', async (req, res) => {
    let params = req.body;
    if (!params.login || !params.password
        || !params.password_confirm || !params.email
        || !params.fullName) {
        return res.sendStatus(400);
    }
    let email_redirect_base = params.email_redirect_base;
    if (!email_redirect_base) email_redirect_base = `http://localhost:3000/api/auth/`;
    if (params.password != params.password_confirm) return res.sendStatus(403);
    try {
        var user = null;
        try {
            user = await User.create({
                login: params.login.trim(),
                password: hashPassword(params.password.trim()),
                email: params.email.trim(),
                fullName: params.fullName.trim()
            });
        } catch (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        if (user == null) return res.sendStatus(403);
        //TODO - send confirmation email
        // create passing token 
        
        
        let jwt_token = jwt.sign({ userId: user.id, type:'activate'}, jwtSecret);
        let email_url = email_redirect_base + '/email-confirmation/' + jwt_token;
        let mail_opts = {
            from: 'mtkachov281@gmail.com',
            to: user.email,
            subject: 'USOF Registration confirmation',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>To confirm your registration click the button below</h1>
    <button><a href="${email_url}">Confirm</a></button>
    <h3>Or click the link: <a href="${email_url}">${email_url}</a></h3>
</body>
</html>
            `
        }
        transporter.sendMail(mail_opts, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                // do something useful
            }
        });
        if (req.files?.profile_picture) {
            let file = req.files?.profile_picture;
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
// REDO
router.post('/email-confirmation/:token', async (req, res) => {
    try {
        let jwt_token = req.params.token;
        try {
            jwt.verify(jwt_token, jwtSecret);
        } catch (err) {
            return res.sendStatus(403);
        }
        let token = jwt.decode(jwt_token, jwtSecret);
        try {
            let user = await User.findByPk(token.userId);
            user.active = true;
            await user.save();
        } catch (err) {
            console.log(err);
            return res.sendStatus(404);
        }
     
        
        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

});

router.get('/email-confirmation/:token', async (req, res) => {
    try {
        let jwt_token = req.params.token;
        try {
            jwt.verify(jwt_token, jwtSecret);
        } catch (err) {
            return res.sendStatus(403);
        }
        let token = jwt.decode(jwt_token, jwtSecret);
        try {
            let user = await User.findByPk(token.userId);
            user.active = true;
            await user.save();
        } catch (err) {
            console.log(err);
            return res.sendStatus(404);
        }
     
        let resultHtml = `
<h1>User successfully activated</>
        `
        
        return res.send(resultHtml);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

});

router.post('/login', async (req, res) => {
    let params = req.body;
    if (!params.login || !params.password) {
        return res.sendStatus(400);
    }
    try {
        let user = await User.findOne({
            where: {
                login: params.login.trim()
            }
        });
        if (!user) return res.sendStatus(404);
        //if (user.email.trim() != params.email.trim()) return res.sendStatus(404);
        if (!user.active) return res.sendStatus(403);

        if (!comparePassword(params.password, user.password)) return res.sendStatus(403);

        let jwtToken = jwt.sign({
            type:'login',
            userId:user.id
        }, jwtSecret);
        res.cookie('authToken', jwtToken, {httpOnly: true, sameSite: 'strict'});
        
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.post('/logout', async (req, res) => {
    res.clearCookie('authToken', {httpOnly: true, sameSite: 'strict'});
    res.sendStatus(200);
});

router.post('/password-reset', async (req, res) => {
    //TODO
    try {
        let params = req.body;
        if (!params.email) return res.sendStatus(400);
        let user = await User.findOne({
            where: {
                email: params.email.trim()
            }
        });
        if (!user) return res.sendStatus(404);
        let email_redirect_base = params.email_redirect_base;
        if (!email_redirect_base) email_redirect_base = `http://localhost:3000/api/auth/`;
        let jwt_token = jwt.sign({ userId: user.id, type:'pass_reset' }, jwtSecret, {expiresIn: '15m'});
        let email_url = email_redirect_base + '/password-reset/' + jwt_token;
        let mail_opts = {
            from: 'mtkachov281@gmail.com',
            to: user.email,
            subject: 'USOF Password reset',
            html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <h1>To change your password click the button below</h1>
        <button><a href="${email_url}">Reset</a></button>
        <h3>Or click the link: <a href="${email_url}">${email_url}</a></h3>
    </body>
    </html>
                `
        };
        transporter.sendMail(mail_opts, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                // do something useful
            }
        });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }


});

router.post('/password-reset/:token', async (req, res) => {
    //TODO
    try {
        if (!req.body.new_password) return res.sendStatus(400);
        let new_password = req.body.new_password.trim();
        if (!new_password) return res.sendStatus(400);
        let jwt_token = req.params.token;
        try {
            jwt.verify(jwt_token, jwtSecret);
        } catch (err) {
            return res.sendStatus(403);
        }
        let token = jwt.decode(jwt_token, jwtSecret);
        let user = await User.findByPk(token.userId);
    
        user.password = hashPassword(new_password);
        await user.save();
    
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

export default router;

