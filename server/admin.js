const app = require('./index.js');
const stripe = require("stripe")(process.env.STRIPE_KEY);

app.post('/api/login', function(req, res) {
  if (req.body.password === process.env.ADMIN_PW) {
    req.session.isAdmin = true;
    res.json({ isAdmin: true })
  } else {
    res.status(401).json({
      error: {
        message: 'Wrong username or password!'
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