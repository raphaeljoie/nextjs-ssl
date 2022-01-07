import 'dotenv/config'

import {createServer} from "https";
import {parse} from 'url'
import * as next from 'next'
import * as fs from "fs";

const dev = process.env.NODE_ENV !== 'production';
const app = next.default({ dev });
const handle = app.getRequestHandler();
const httpsOptions = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt'),
};
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Server started on https://localhost:3000');
  });
});
