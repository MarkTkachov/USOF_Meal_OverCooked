import { User, Post, Category, Comment, PostLike, CommentLike} from './model.js';
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import * as AdminJSSequelize from '@adminjs/sequelize'
import { hashPassword, comparePassword } from './utils/hash.js';

AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
})


const authenticate = async (email, password) => {
    let user = await User.findOne({
        where: {
            email: email,
            role: 'Admin'
        }
    });
    if (!user) return null;
    if (comparePassword(password, user.password)) {
        return Promise.resolve(user);
    }
    else return null;
}

const PORT = 3001

const start = async () => {
    const app = express()
    const adminOptions = {
        resources: [
            {
                resource: User,
                options: {
                    properties: {
                        login: {
                            isVisible: true
                        },
                        password: {
                            isVisible: false,
                        },
                        userPassword: {
                            type: 'string',
                            isRequired: true,
                            isVisible: {
                                // Make password visible in the edit mode.
                                list: false,
                                edit: true,
                                filter: false,
                                show: false,
                            },
                        },
                        rating: {
                            isVisible: false
                        },
                        profilePicture: {
                            isVisible: {
                                list: false,
                                edit: true,
                                filter: false,
                                show: true
                            }
                        }
                    },
                    actions: {
                        new: {
                            // Hash the password.
                            before: async (request) => {
                                if(request?.payload?.userPassword) {
                                    request.payload = {
                                        ...request.payload, 
                                        password: hashPassword(request.payload.userPassword),
                                        userPassword: undefined,
                                    }
                                }                
                                return request
                            },
                        }
                    }
                }
                
            },

            {
                resource: Post,
                options: {
                    properties: {
                        content: {
                            isDisabled: true,
                            isVisible: {
                                list: true,
                                edit: false,
                                filter: false,
                                show: true
                            }
                        },
                        postContent: {
                            isVisible: {
                                list: false,
                                edit: true,
                                filter: false,
                                show: false
                            }
                        }

                    },
                    actions: {
                        new: {
                            before: async (request) => {
                                if(request?.payload?.postContent) {
                                    request.payload = {
                                        ...request.payload, 
                                        content: request.payload.postContent
                                    }
                                }                
                                return request
                            }
                        }
                    }
                }
            },
            {
                resource: Category,
                options: {

                }
            },
            {
                resource: Comment,
                options: {
                    properties: {
                        content: {
                            isDisabled: true,
                            isVisible: {
                                list: true,
                                edit: false,
                                filter: false,
                                show: true
                            }
                        },
                        commentContent: {
                            isVisible: {
                                list: false,
                                edit: true,
                                filter: false,
                                show: false
                            }
                        }

                    },
                    actions: {
                        new: {
                            before: async (request) => {
                                if(request?.payload?.commentContent) {
                                    request.payload = {
                                        ...request.payload, 
                                        content: request.payload.commentContent
                                    }
                                }                
                                return request
                            }
                        }
                    }
                }
            },
            {
                resource: PostLike,
                options: {

                }
            },
            {
                resource: CommentLike,
                options: {

                }
            },
        ]
    }


    const admin = new AdminJS(adminOptions)

    const adminRouter = AdminJSExpress.buildRouter(admin)
    // const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    //     authenticate,
    //     cookieName: 'adminjs_usof_admin_panel',
    //     cookiePassword: 'securepass'
    // },
    // null,
    // {
    //     resave: true,
    //     saveUninitialized: true,
    //     secret: 'securepass'
    // });
    app.use(admin.options.rootPath, adminRouter)

    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })

}

start()


