import appRoutes from './routes';
import {App} from '../../../../core/server/app';
import config from '../config/default.json';
App.build({
    appRoutes,
    dbConfig: config.dbConfig
}).run();
