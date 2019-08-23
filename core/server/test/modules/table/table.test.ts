import * as request from 'supertest';
import {Application} from 'express';
import { App } from '../../../app';
import {tableModuleRouters} from '../../../modules/table';

const moduleRoute = (app: Application) => {
    tableModuleRouters(app);
};

describe('Test', () => {
    it('test1', () => {
        /*request(App.build(moduleRoute).getApp())
            .get('/api/table/test')
            .then((response) => {
                console.log(response);
            } )*/
    })
});
