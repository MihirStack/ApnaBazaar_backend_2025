import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../utils/http-status';
import { UserService } from '../services/user.service';
import { sequelize } from '../server';
import { encrypt } from '../utils/crypto-helper';

export class UserController extends HttpStatus {
    public userService: UserService = new UserService();
    
    /** GET API: get all users */
    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get all users
            const users = await this.userService.getAllUsers();
            if (!users.length) return this.notFound(res, 'Users not found.', users);

            this.success(res, 'Users get successfully.', users);
        } catch (err) {
            if (err instanceof Error) {
                this.badRequest(res, err.message);
                next(err);
            }
        }
    };

    // /** GET API: get user with pagination */
    // public getUserWithPagination = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const { page, limit } = req.query;
    //         const users = await this.userService.getUserWithPagination(page, limit);
    //         if (!users.length) return this.notFound(res, 'Users not found.', users);

    //         this.success(res, 'Users get successfully.', users);
    //     }
    //     catch (err) {
    //         if (err instanceof Error) {
    //             this.badRequest(res, err.message);
    //             next(err);
    //         }
    //     }
    // }

    /** GET API: get user by id */
    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            if (!user) return this.notFound(res, 'User not found.', user);

            this.success(res, 'User get successfully.', user);
        } catch (err) {
            if (err instanceof Error) {
                this.badRequest(res, err.message);
                next(err);
            }
        }
    }

    /** POST API: create user */
    public registerUser = async (req: Request, res: Response, next: NextFunction) => {
        const transaction = await sequelize.transaction();
        try {
            const { name, username, email, password } = req.body;

            const user = await this.userService.registerUser(name, username, email, password, transaction );
            if (!user) {
                await transaction.rollback();
                return this.badRequest(res, 'User not created.');
            }

            await transaction.commit();
            this.success(res, 'User created successfully.', user);
        } catch (err) {
            await transaction.rollback();
            if (err instanceof Error) {
                this.badRequest(res, err.message);
                next(err);
            }
        }
    }

    /** POST API: login user */
    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const user = await this.userService.loginUser(email, password);
            if (!user) return this.badRequest(res, 'Invalid email or password.');

            const token = encrypt({ id: user.id, email: user.email });
            if (!token) return this.badRequest(res, 'Token not generated.');

            this.success(res, 'User logged in successfully.', { user, token });
        } catch (err) {
            if (err instanceof Error) {
                this.badRequest(res, err.message);
                next(err);
            }
        }
    }

    /** PUT API: update user */
    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { name, username, email, password } = req.body;

            const user = await this.userService.updateUser(id, name, username, email, password, transaction);
            if (!user) {
                await transaction.rollback();
                return this.badRequest(res, 'User not updated.');
            }

            await transaction.commit();
            this.success(res, 'User updated successfully.', user);
        } catch (err) {
            if (err instanceof Error) {
                await transaction.rollback();
                this.badRequest(res, err.message);
                next(err);
            }
        }
    }

    /** DELETE API: delete user */
    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await this.userService.deleteUser(id);
            if (!user) return this.badRequest(res, 'User not deleted.');

            this.success(res, 'User deleted successfully.', user);
        } catch (err) {
            if (err instanceof Error) {
                this.badRequest(res, err.message);
                next(err);
            }
        }
    }
}