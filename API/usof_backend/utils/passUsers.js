import { jwtSecret } from "./jwtHelper.js";
import jwt from 'jsonwebtoken';
import { User } from "../model.js";

async function passLoggedIn(req, res, next) {
    let token = req.cookies.authToken;
    if (!token) return res.sendStatus(401);
    try {
        jwt.verify(token, jwtSecret);
        let data = jwt.decode(token, jwtSecret);
        let user = await User.findByPk(data.userId);
        if (!user) return res.sendStatus(401);
        req.userId = data.userId;
        req.isAdmin = false;
        if (user.role == 'Admin') req.isAdmin = true;
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(401);
    }
    
}

async function passAdmin(req, res, next) { 
    let token = req.cookies.authToken;
    if (!token) return res.sendStatus(401);
    try {
        jwt.verify(token, jwtSecret);
        let data = jwt.decode(token, jwtSecret);
        let id = data.userId;
        let user = await User.findByPk(id);
        if (user.role != 'Admin') return res.sendStatus(403);
        req.userId = user.id;
        req.isAdmin = true;
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(401);
    }
    
}

async function getUserId(req) {
    let token = req.cookies.authToken;
    if (!token) return null;
    try {
        jwt.verify(token, jwtSecret);
    } catch (err) {
        return null;
    }
    let data = jwt.decode(token, jwtSecret);
    let user = await User.findByPk(data.userId);
    if (!user) return null;
    req.userId = data.userId;
    req.isAdmin = false;
    if (user.role == 'Admin') req.isAdmin = true;
    return data.userId;
}

function isAdminLoggedIn(req) {
    return req.isAdmin;
}

export { passLoggedIn, passAdmin, isAdminLoggedIn , getUserId};
