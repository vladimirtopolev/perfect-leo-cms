import {Application} from 'express';
import {tableModuleRouters} from '../../../../../core/server/modules/table'

export default (app: Application) => {
    tableModuleRouters(app);
}
