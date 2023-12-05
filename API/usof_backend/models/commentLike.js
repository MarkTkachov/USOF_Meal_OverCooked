import sequelize from "../db.js";
import { Model, DataTypes } from 'sequelize';

class CommentLike extends Model {
}

CommentLike.init({
    publishDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    isDislike: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {sequelize, timestamps: false})

export default CommentLike
