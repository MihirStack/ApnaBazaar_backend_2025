import { Op } from 'sequelize';
import { hashAsync } from '../../utils/crypto-helper';
import { User } from '../user.model';

export const userHooks = {
    // User create hook
    beforeCreate: async (user: User) => {
        const existingUser = await User.findOne({ where: { username: user.username } });
        if (existingUser) throw new Error('Username already exists.');
    },

    // Hash password hook
    hashPassword: async (user: User) => {
        // Check if the password field is present and has been modified (or is new)
        if (user.password && user.changed('password')) {
            user.password = await hashAsync(user.password);
        }
    },

    // User update hook
    beforeUpdate: async (user: User) => {
        const existingUser = await User.findOne({ where: { username: user.username, id: { [Op.ne]: user.id } } });
        if (existingUser) throw new Error('Username already exists.');
    },
};
