import  mongoose from 'mongoose';
import {Mongoose} from "mongoose";
import {DBConfig} from './app';

export const open = (dbConfig: DBConfig): Promise<Mongoose> => {
    return mongoose.connect(dbConfig.host, {dbName: dbConfig.dbName})
        .then((mongoose: Mongoose) => {
            console.log(`Connection to DB is successful: ${dbConfig.host}`);
            return mongoose;
        });
};
