const dotenv = require('dotenv').config({ path: 'config.env' });
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const app = module.exports = express();

app.use(helmet());
app.use(cookieParser());

// app will not work without setting up the config.env file
// https://belugajs.com/docs/new-store
if (dotenv.error) throw dotenv.error;

var sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false
  },
  resave: false,
  saveUninitialized: true,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(session(sess))
app.use(bodyParser.json());

require(__dirname + '/product.js');
require(__dirname + '/orders.js');
require(__dirname + '/admin.js');
require(__dirname + '/config.js');

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(5000, function() {
  console.log("Listening on port 5000!");
});