import { Router } from 'express';
import { UserRoutes } from './user.routes';

export class Routes {
    public router = Router();

    // Create routes instances
    private userRoutes: UserRoutes = new UserRoutes();

    constructor() {
        // Initialize routes
        this.router.use('/user', this.userRoutes.router);
    }
}