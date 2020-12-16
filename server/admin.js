const app = require('./index.js');
const stripe = require("stripe")(process.env.STRIPE_KEY);
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { parse, stringify } = require('envfile');
const pathToenvFile = 'config.env';
const saltRounds = 13;

if ( !process.env.ADMIN_PW ){
	throw 'ADMIN_PW must be provided in config.env';
}

if ( !process.env.PASSWORD_IS_HASHED || process.env.PASSWORD_IS_HASHED !== 'true' ){
	bcrypt.hash(process.env.ADMIN_PW, saltRounds, function(err, hash) {
		fs.readFile(pathToenvFile, {encoding:'utf8', flag:'r'}, function(err, data) {
			if(err) {
				console.log(err);
			}
			let result = parse(data);
			result['ADMIN_PW'] = hash;
			result['PASSWORD_IS_HASHED'] = 'true';
			process.env['ADMIN_PW'] = hash;
			process.env['PASSWORD_IS_HASHED'] = 'true';	

			fs.writeFile(pathToenvFile, stringify(result), function (err) {
				if (err) {
					console.log(err);
				}
			});
		});
	});
}

const apiLimiter = rateLimit({
	windowMs: process.env.LOGIN_LIMIT_TIME_PERIOD || 15 * 1000,
	max: process.env.LOGIN_REQUESTS_PER_PERIOD || 1
});

app.use('/api/login', apiLimiter);

app.post('/api/login', function(req, res) {
  bcrypt.compare(req.body.password, process.env.ADMIN_PW, (err, result) => {
	if ( result === true ) {
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
