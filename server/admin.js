const dotenv = require('dotenv').config({ path: 'config.env' });
const app = require('./index.js');
const stripe = require("stripe")(process.env.STRIPE_KEY);
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const stringify = require('dotenv-stringify');
const fs = require('fs');

const pathToenvFile = 'config.env';
const saltRounds = 13;

if ( !process.env.PASSWORD_IS_HASHED || process.env.PASSWORD_IS_HASHED !== 'true' ){
  if ( process.env.ADMIN_PW ){
    bcrypt.hash(process.env.ADMIN_PW, saltRounds, function(err, hash) {
      fs.readFile(pathToenvFile, {encoding:'utf8', flag:'r'}, function(err, envFile) {
        if(err) {
          console.log(err);
          return;
        }

        process.env['ADMIN_PW'] = hash;
        process.env['PASSWORD_IS_HASHED'] = 'true';

        let parsedEnv = dotenv.parsed;
        parsedEnv['ADMIN_PW'] = hash;
        parsedEnv['PASSWORD_IS_HASHED'] = 'true';

        fs.writeFile(pathToenvFile, stringify(parsedEnv), function (err) {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  }
}

const apiLimiter = rateLimit({
  windowMs: process.env.LOGIN_LIMIT_TIME_PERIOD || 15 * 1000,
  max: process.env.LOGIN_REQUESTS_PER_PERIOD || 1
});

app.use('/api/login', apiLimiter);

app.post('/api/login', function(req, res) {
  bcrypt.compare(req.body.password, process.env.ADMIN_PW, (err, result) => {
  if ( process.env.ADMIN_PW && result === true ) {
    req.session.isAdmin = true;
    res.json({ isAdmin: true })
  } else {
    res.status(401).json({
      error: {
        message: 'Wrong password!'
      }
    })
  }
  });
});

app.get('/api/logout', function(req, res) {
  req.session.isAdmin = false;
  res.redirect("/login");
})


let alwaysLogInAdmin = false;
/*
  uncomment the next line if you want to assume development is always ok to view orders
  in your config.env file, add the line:
  NODE_ENV=development

  VERY IMPORTANT: when deploying your site, do NOT keep that line in your config.env,
  or else everyone will be able to access your stripe data!
*/
// if (process.env.NODE_ENV === "development") alwaysLogInAdmin = true;

app.get('/orders/:status', function(req, res) {
  if (req.session.isAdmin || alwaysLogInAdmin) {
    stripe.orders.list({ status: req.params.status },
      function(err, orders) {
        if (orders) res.json(orders.data);
      });
  } else {
    res.redirect("/login");
  }
});

app.get('/user', function(req, res) {
  let isAdmin = false;
  if (req.session.isAdmin || alwaysLogInAdmin) isAdmin = true;
  res.json({ isAdmin });
});
