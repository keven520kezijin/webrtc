'use strict'

let http = require('http');
let https = require('https');
let fs = require('fs');

let express = require('express');
let serveIndex = require('serve-index');

let app = express();
app.use(serveIndex('./public'))
app.use(express.static('./public'));

// http server
let http_server = http.createServer(app);
http_server.listen(10010, '0.0.0.0');

let options = {
  key: fs.readFileSync('./test.szjcomo.com.key'),
  cert: fs.readFileSync('./test.szjcomo.com.crt')
}

let https_server = https.createServer(options, app).listen(10086, '0.0.0.0');
