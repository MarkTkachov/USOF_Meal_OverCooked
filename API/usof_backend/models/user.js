import sequelize from "../db.js";
import { Sequelize, Model, DataTypes } from 'sequelize';

class User extends Model {
    async getRating() {
        let rating = 0;
        let posts = await this.getPosts();
        let comments = await this.getComments();

        for (const post of posts) {
            let likes = await post.countLikes({
                where: { isDislike: false }
            });
            let dislikes = await post.countLikes({
                where: { isDislike: true }
            });
            rating += likes - dislikes;
        }
        for (const comment of comments) {
            let likes = await comment.countLikes({
                where: { isDislike: false }
            });
            let dislikes = await comment.countLikes({
                where: { isDislike: true }
            });
            rating += likes - dislikes;
        }
        return rating;
    }
}

User.init({
    login: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    profilePicture: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('User', 'Admin'),
        allowNull: false,
        defaultValue: 'User'
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        //TODO - set to false
        defaultValue: true
    }
}, { sequelize, modelName: 'user', timestamps: false});

export default User;







