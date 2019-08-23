import * as mongoose from 'mongoose';

const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt-nodejs');

// TODO: eliminate and move into config file
const SALT: String = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa';

export interface User extends mongoose.Document {
    username: string
    email: string,
    firstName: string,
    lastName: string,
    created?: Date,
    password: string,

    checkPassword?(password: string): boolean
}

const UserSchema: mongoose.Schema = new mongoose.Schema<User>({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.pre<User>('save', function (next) {
    this.password = bcrypt.hashSync(this.password, SALT);
    next();
});


UserSchema.method('checkPassword', function (this: User, password: string): boolean {
    return bcrypt.compareSync(password, this.password);
});

UserSchema.method('toJSON', function (this: User) {
    const obj = this.toObject();
    delete obj.password;
    return obj;
});

UserSchema.plugin(uniqueValidator, {message: 'Path `{PATH}` must be unique'});

export const UserModel: mongoose.Model<User> = mongoose.model<User>('User', UserSchema);

