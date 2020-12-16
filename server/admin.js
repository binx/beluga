const app = require('./index.js');
const stripe = require("stripe")(process.env.STRIPE_KEY);
const rateLimit = require('express-rate-limit');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// // see https://expressjs.com/en/guide/behind-proxies.html
// // app.set('trust proxy', 1);

const apiLimiter = rateLimit({
	windowMs: process.env.LOGIN_LIMIT_TIME_PERIOD || 15 * 1000,
	max: process.env.LOGIN_REQUESTS_PER_PERIOD || 1
});

app.use('/api/login', apiLimiter);

app.post('/api/login', function(req, res) {
  if (req.body.password === process.env.ADMIN_PW) {
    req.session.isAdmin = true;
    res.json({ isAdmin: true })
  } else {
    res.status(401).json({
      error: {
        message: 'Wrong password!'
      }
    });
  }
});

app.get('/api/logout', function(req, res) {
  req.session.isAdmin = false;
  res.redirect("/login");
})

app.get('/orders/:status', function(req, res) {
  if (req.session.isAdmin) {
    stripe.orders.list({ status: req.params.status },
      function(err, orders) {
        if (orders) res.json(orders.data);
      });
  } else {
    res.redirect("/login")
  }
});

app.get('/user', function(req, res) {
  res.json({ isAdmin: req.session.isAdmin || false })
});
