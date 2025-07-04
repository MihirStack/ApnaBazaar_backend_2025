import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { SchemaMiddleware } from '../middleware/schema-validator.middleware';
import { UserValidateSchema } from '../validations/user.validation';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class UserRoutes {

    public userController: UserController = new UserController();
    public schemaMiddleware: SchemaMiddleware = new SchemaMiddleware();
    public userValidateSchema: UserValidateSchema = new UserValidateSchema();
    public authMiddleware: AuthMiddleware = new AuthMiddleware();
    public router: Router = Router();

    constructor() {
        this.config();
    }

    private config(): void {
        this.router.get('/all', this.userController.getAllUsers);
        this.router.get('/:id', this.authMiddleware.validateToken, this.schemaMiddleware.validateSchema(this.userValidateSchema.getUserSchema), this.userController.getUserById);
        this.router.post('/register', this.schemaMiddleware.validateSchema(this.userValidateSchema.createUserSchema), this.userController.registerUser);
        this.router.post('/login', this.schemaMiddleware.validateSchema(this.userValidateSchema.loginUserSchema), this.userController.loginUser);
        this.router.put('/:id', this.authMiddleware.validateToken, this.schemaMiddleware.validateSchema(this.userValidateSchema.updateUserSchema), this.userController.updateUser);
        this.router.delete('/:id', this.authMiddleware.validateToken, this.schemaMiddleware.validateSchema(this.userValidateSchema.userIdSchema), this.userController.deleteUser);
    }
};