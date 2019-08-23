import {Application, Request, Response} from 'express';
import tableController from './controllers/table.controller';

export const tableModuleRouters = (app: Application, domainPath: string = '/api/tables') => {

    app.route(`${domainPath}/:tableName`)
        .get(tableController.getTable);

    app.route(`${domainPath}/:tableName/headers`)
        .get(tableController.getHeaders);

    app.route(`${domainPath}/:tableName/rows`)
        .get(tableController.getRows)
        .post(tableController.createRow);

    app.route(`${domainPath}/:tableName/rows/:rowId`)
        .get(tableController.getRow)
        .put(tableController.updateRow)
        .delete(tableController.deleteRow);
};
