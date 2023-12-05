import sequelize from "../db.js";
import { Sequelize, Model, DataTypes } from 'sequelize';

class Post extends Model {
    async getRating() {
        let likes = await this.countLikes({
            where: {
                isDislike: false
            }
        });
        let dislikes = await this.countLikes({
            where: {
                isDislike: true
            }
        });
        return likes - dislikes;
    }
}

Post.init({
    // author FK done
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    publishDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    type: {
        type: DataTypes.ENUM('plain', 'markdown'),
        allowNull: false,
        defaultValue: 'plain'
    }
    //categories M2M
}, { sequelize , modelName: 'post', timestamps: false});

export default Post;


