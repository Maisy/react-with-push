const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 7777;

app.use(express.json());

//router
const basicRouter = require('./router');
app.use(basicRouter);

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
