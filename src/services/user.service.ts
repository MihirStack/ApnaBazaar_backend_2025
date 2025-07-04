import { Transaction } from 'sequelize';
import { User } from '../models/user.model';
import { compareAsync } from '../utils/crypto-helper';
        
export class UserService {
    /** Get all users */
    public getAllUsers = async () => {
        return await User.findAll();
    };

    /** Get user by id */
    public getUserById = async (id: string) => {
        return await User.findByPk(id);
    };

    /** Create user */
    public registerUser = async (name: string, username: string, email: string, password: string, transaction?: Transaction) => {
        return await User.create({ name, username, email, password }, { transaction });
    };

    /** Login user */
    public loginUser = async (email: string, password: string) => {
        const user = await User.findOne({ where: { email } });
        if (!user) return null;
        const isPasswordValid = await compareAsync(password, user.password);
        return isPasswordValid ? user : null;
    };

    /** Update user */
    public updateUser = async (id: string, name: string, username: string, email: string, password: string, transaction?: Transaction) => {
        return await User.update({ name, username, email, password }, { where: { id }, transaction });
    };

    /** Delete user */
    public deleteUser = async (id: string) => {
        return await User.destroy({ where: { id } });
    };
}