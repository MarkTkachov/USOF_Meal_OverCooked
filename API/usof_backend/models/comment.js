import sequelize from "../db.js";
import { Sequelize, Model, DataTypes } from 'sequelize';

class Comment extends Model {
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

Comment.init({
    //author FK
    publishDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    }
    // post FK
}, { sequelize, modelName: 'comment', timestamps: false })

export default Comment;


