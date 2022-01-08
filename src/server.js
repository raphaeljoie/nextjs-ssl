require('dotenv/config')

const {createServer} = require("https");
const {parse} = require('url')
const next = require('next')
const pem = require('pem');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const config = `[dn]
CN=localhost
[req]
distinguished_name = dn
[v3_req]
subjectAltName=DNS:localhost
keyUsage=digitalSignature
extendedKeyUsage=serverAuth`

const run = () => {
    app.prepare()
        .then(() => pem.promisified.createPrivateKey(2048))
        .then(({key}) => pem.promisified.createCSR({
            hash: 'sha256',
            commonName: 'localhost',
            clientKey: key,
            config: config,
        }))
        .then(({csr, clientKey}) => pem.promisified.createCertificate({
            csr: csr,
            days: 365,
            hash: 'sha256',
            clientKey: clientKey,
            selfSigned: true,
            config: config,
        }))
        .then(({certificate, csr, clientKey, serviceKey}) => {
            createServer({key: clientKey, cert: certificate}, (req, res) => {
                const parsedUrl = parse(req.url, true);
                handle(req, res, parsedUrl);
            }).listen(3000, (err) => {
                if (err) throw err;
                console.log('> Server started on https://localhost:3000');
            });
        });
}

module.exports.run = run;
