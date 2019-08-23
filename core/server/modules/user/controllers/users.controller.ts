import {Request, Response} from 'express';
import {UserModel, User} from '../models/user.model';
import * as config from 'config';
import * as jwt from 'jsonwebtoken';

export function createUserToken(user: User) {
    return jwt.sign({user}, config.get('authentication.token.secret'));
}

class UsersController {
    getAllUsers = (req: Request, res: Response) => {
        UserModel.find({})
            .exec()
            .then(users => res.json(users))
            .catch(err => res.status(500).json({error: 'Server DB error'}));
    };

    signin = (req: Request, res: Response) => {
        const {identifier, password} = req.body;
        UserModel.findOne({$or: [{username: identifier}, {email: identifier}]})
            .exec()
            .then(user => {
                if (!user) {
                    return res.status(401).json({error: 'There is no user with such username'});
                }
                if (user.checkPassword(password)) {
                    return res.json({token: createUserToken(user)});
                }
                return res.status(401).json({error: 'Password is incorrect'});
            })
            .catch(err => res.status(401).json({error: 'Problem with server'}));
    };
}

export default new UsersController();
