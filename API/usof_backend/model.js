import sequelize from "./db.js";
import { Sequelize, Model, DataTypes } from 'sequelize';
import User from './models/user.js';
import Post from './models/post.js';
import Category from './models/category.js';
import Comment from './models/comment.js';
import PostLike from "./models/postLike.js";
import CommentLike from "./models/commentLike.js";


Post.belongsTo(User, { as: 'author' , foreignKey: 'authorId'});
User.hasMany(Post, {foreignKey: 'authorId'});



//Many to Many with categories
class PostCategories extends Model {}
PostCategories.init({}, {sequelize, timestamps: false, modelName: 'posts_categories'});

Post.belongsToMany(Category, {
    through: PostCategories
});

Category.belongsToMany(Post, {
    through: PostCategories
});

Post.hasMany(Comment);




User.hasMany(Comment, { foreignKey: 'authorId'});
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId'});
//Comment can belong only to a post
//I will do not have time for commenting other comments
Comment.belongsTo(Post);



PostLike.belongsTo(Post, {onDelete: 'CASCADE'});
Post.hasMany(PostLike, {as: 'likes', onDelete: 'CASCADE'})

CommentLike.belongsTo(Comment, {onDelete: 'CASCADE'});
Comment.hasMany(CommentLike, {as: 'likes', onDelete: 'CASCADE'})



PostLike.belongsTo(User, { as: 'author', onDelete: 'CASCADE'});
User.hasMany(PostLike, {foreignKey: 'authorId', onDelete: 'CASCADE'});

CommentLike.belongsTo(User, { as: 'author', onDelete: 'CASCADE'});
User.hasMany(CommentLike, {foreignKey: 'authorId', onDelete: 'CASCADE'});

//Favourites
class UserPostFavourites extends Model {}
UserPostFavourites.init({}, {sequelize, timestamps: false, modelName: 'user_post_favourites'});

User.belongsToMany(Post, {as: 'favourites', through: UserPostFavourites});
Post.belongsToMany(User, {as: 'favouriteHaver', through: UserPostFavourites});



export {
    User,
    Post,
    Category,
    Comment,
    PostLike,
    CommentLike,
    sequelize
}

