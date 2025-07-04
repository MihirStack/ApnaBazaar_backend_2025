import { Optional } from 'sequelize';

/** Define the interface for the create user params */
export type UserParams = Optional<{
    id?: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
}, 'id'>;