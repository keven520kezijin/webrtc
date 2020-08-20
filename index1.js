'use strict'

let https = require('https');
let fs = require('fs');

let options = {
  key: fs.readFileSync('./test.szjcomo.com.key'),
  cert: fs.readFileSync('./test.szjcomo.com.crt')
}

let app = https.createServer(options, (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World \n nihao')
}).listen(10086, '0.0.0.0');
