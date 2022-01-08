# NextJS with SSL
> https://localhost, made simple


Simply generate SSL certificate in your project next root directory
```shell
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -days 365 \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
and run
```shell
$ next-ssl
```

## Example
```
cd example
npm run dev
```
and browse https://localhost:3000

## Dev
```
npm-link
```
