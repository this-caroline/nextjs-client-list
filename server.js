const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const pathMatch = require('path-match');
const app = next({ dev });
const handle = app.getRequestHandler();
const { parse } = require('url');

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  server.use('/api', require('./server/api'));

  // Server-side
  const route = pathMatch();

  server.get('/employees', (req, res) => {
    return app.render(req, res, '/search', req.query);
  });

  server.get('/employees/:id', (req, res) => {
    const params = route('/employees/:id')(parse(req.url).pathname);
    return app.render(req, res, '/employees', params);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('Server ready on http://localhost:3000');
  });
});
