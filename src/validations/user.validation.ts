import Joi from 'joi';

export class UserValidateSchema {

    /** Schema for validating the request body when get all a user */
    public getUserSchema = Joi.object({
        search: Joi.string().optional(),
        pageIndex: Joi.string().optional(),
        pageSize: Joi.string().optional(),
        sortColumn: Joi.string().optional(),
        sortDirection: Joi.string().optional(),
    });

    /** Schema for validating the request body when create a user */
    public createUserSchema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().trim().lowercase().required().messages({
            'string.email': 'Invalid email address.',
        }),
        password: Joi.string().required().min(8).messages({
            'string.min': 'Password must be at least 8 characters long.',
        }),
    });

    /** Schema for validating the request body when login a user */
    public loginUserSchema = Joi.object({
        email: Joi.string().email().trim().lowercase().required().messages({
            'string.email': 'Invalid email address.',
        }),
        password: Joi.string().required().messages({
            'string.min': 'Password must be at least 8 characters long.',
        }),
    });

    /** Schema for validating the request body when update a user */
    public updateUserSchema = Joi.object({
        name: Joi.string().optional(),
        username: Joi.string().optional(),
        email: Joi.string().email().trim().lowercase().optional().messages({
            'string.email': 'Invalid email address.',
        }),
    });

    /** Schema for validating the request body when delete a user */
    public userIdSchema = Joi.object({
        id: Joi.string().required(),
    });
}