import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv'

import cors from 'cors';
import {configureAuthModule} from './routes/auth'
import {configureApiModule} from './routes/apis'
import passport from "passport";
import { CronJobManager } from "./cron/cron.js";
import session from "express-session";


        dotenv.config();

        const app = express();

        app.use(json());

        app.use(
            urlencoded({
                extended: true,
            })
        );

        app.use(cors({
            origin: process.env.CORS_URL,
            credentials: true  ,
        }));

        app.use(
            session({
                secret: "Claralia",
                proxy: true,
                resave: false,
                saveUninitialized: true,
                cookie: {
                    secure: process.env.IS_PROD === "true",
                    sameSite: process.env.IS_PROD === "true" ? "none" : false,
                },
            })
        );

        app.use(passport.initialize());
        app.use(passport.session());
            
        configureAuthModule(app);
        
        configureApiModule(app);

        CronJobManager.getInstance();
       
        app.listen(process.env.PORT, () => {
            console.log(`Server listening on ${process.env.PORT}!`);
        });
        







