import express from 'express';
import logger from 'morgan';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSanitizer from 'express-sanitizer';
import helmet from 'helmet';
import rfs from 'rotating-file-stream';
import './passport.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


export default {
    setup: (config ) => {
        const app = express();

        var accessLogStream = rfs('access.log', {
            interval: '1d',
            path: path.join(__dirname, '..', 'log')
        })
        
        app.use(logger(config.log, { stream: accessLogStream }));

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({limit: '50mb'}));

        app.use(cookieParser(config.secret));
        app.use(session({ secret: config.secret ,resave: true, saveUninitialized:true}));
        app.use("/photo", express.static(path.join(__dirname, 'public/images')));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(expressSanitizer());
        app.use(helmet());
        app.use(helmet.hsts({
            maxAge: 0
        }))

        Number.prototype.pad = function (size) {
            var s = String(this);
            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
        }
        
        return app;
    }
}
