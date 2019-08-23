import  express from "express";
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import {open} from './dbConnection';

export type AppRoutes = (app: express.Application) => void;
export interface DBConfig {
    host: string,
    dbName: string
}

export interface AppConfig  {
    appRoutes: AppRoutes,
    dbConfig: DBConfig
}

export class App {
    app: express.Application;
    config: AppConfig;

    constructor(appConfig: AppConfig) {
        this.app = express();
        this.config = appConfig;

        this.configApp();
        this.initRoutes(appConfig.appRoutes);
    }

    public static build(appConfig: AppConfig): App {
        return new App(appConfig);
    }

    public getApp(): express.Application {
        return this.app;
    }

    run() {
        const PORT = process.env.PORT || 5000;

        open(this.config.dbConfig)
            .then(() => this.app.listen(PORT, () => console.log(`Listening on ${PORT}`)))
            .catch(e => console.log(e))
    }

    private configApp() {
        // parse application/json and look for raw text
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.text());
        this.app.use(bodyParser.json({type: 'application/json'}));

        //include logger
        this.app.use(morgan('tiny'));
    }

    private initRoutes(appRoutes: AppRoutes) {
        appRoutes(this.app);
    }
}
