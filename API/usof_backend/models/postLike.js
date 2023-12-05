import sequelize from "../db.js";
import { Model, DataTypes } from 'sequelize';

class PostLike extends Model {
}

PostLike.init({
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

export default PostLike
