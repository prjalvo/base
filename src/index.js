import 'dotenv/config';
import { db } from './models/index.js';
import { restRouter } from './api/index.js';
import config from './config/app.js';
import appManager from './app.js';
//import kue from './kue';
import './errors.js';
import scheduler from './scheduler.js';
import path from 'path';
import cors from 'cors';
import { s3, bucket, upload } from "./middleware/bucket.js";

// import axios from 'axios';
// import https from 'https';
// import multer from "multer";

// import express from 'express';

// const upload = multer();


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

global.appRoot = path.resolve(__dirname);

//const PORT = config.app.port;
const app = appManager.setup(config);



// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

/*cors handling*/
app.use(cors({
	origin:true,
    credentials:true
}));
app.options('*', cors());

/* Route handling */
app.use('/api', restRouter);
// app.use('/', webRouter);

app.post("/api/upload", upload.single("file"), (req, res) => {
    return res.status(200).json({ message: req.file.location });
 });

// app.post('/api/generate-doc',upload.none(), async (req, res) => {
//     try {
//         const response = await axios.post('http://185.228.72.82:9002/generate-doc', req.body, {
//             httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Desabilitar SSL
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//             responseType: 'blob',
//         });
//         res.send(response.data);
//     } catch (error) {
//         res.status(500).send('Erro na chamada à API');
//     }
// });


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin',"http://localhost:3000");
    res.setHeader('Access-Control-Allow-Headers',"*");
    res.header('Access-Control-Allow-Credentials', true);
    next(new RequestError('Invalid route', 404));
});

app.use((error, req, res, next) => {
	if (!(error instanceof RequestError)) {
		error = new RequestError('Some Error Occurred', 500, error.message);
    }
		error.status = error.status || 500;
	res.status(error.status);
	let contype = req.headers['content-type'];
	var json = !(!contype || contype.indexOf('application/json') !== 0);
	if (json) {
		return res.json({ errors: error.errorList });
	} else {
		res.render(error.status.toString(), {layout: null})
	}
});

//kue.init();
/* Database Connection */
db.sequelize.authenticate().then(function () {
	console.log('Nice! Database looks fine');
	scheduler.init();
}).catch(function (err ) {
	console.log(err, "Something went wrong with the Database Update!")
});



/* Start Listening service */
app.listen(5000, () => {
	console.log(`Server is running at PORT http://localhost:`);
});
