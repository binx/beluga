const app = require('./index.js');
const rimraf = require("rimraf");
const stripe = require("stripe")(process.env.STRIPE_KEY);

app.get('/product-info/:id', function(req, res) {
  stripe.skus.list({ product: req.params.id },
    function(err, product) {
      err ? res.status(500).send(err) : res.json(product);
    });
});

app.get('/product-info/', function(req, res) {
  stripe.skus.list(
    function(err, skus) {
      err ? res.status(500).send(err) : res.json(skus.data);
    });
});

app.post("/create-product", function(req, res) {
  const product = {
    name: req.body.name,
    type: 'good'
  }
  if (req.body.attributes)
    product["attributes"] = [req.body.attributes];

  stripe.products.create(product, function(err, result) {
    err ? res.status(500).send(err) : res.json(result);
  });
});

app.post("/update-product/:id", function(req, res) {
  let product = {};
  if (req.body.name) product["name"] = req.body.name;
  if (req.body.attributes) product["attributes"] = [req.body.attributes];

  stripe.products.update(req.params.id, product, function(err, confirmation) {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});

app.post("/delete-product/:id", function(req, res) {
  rimraf(`./public/assets/${req.params.id}`, function(error) {
    stripe.products.del(req.params.id, function(err, confirmation) {
      err ? res.status(500).send(err) : res.json({ success: true });
    });
  });
});

app.post("/create-sku", function(req, res) {
  let sku = {
    price: +req.body.price,
    currency: 'usd',
    inventory: {
      type: req.body.inventory.type
    },
    product: req.body.product_id
  }
  if (req.body.inventory.type === "finite")
    sku.inventory["quantity"] = +req.body.inventory.quantity;

  if (req.body.attributes)
    sku["attributes"] = req.body.attributes;

  stripe.skus.create(sku, function(err, confirmation) {
    err ? res.status(500).send(err) : res.json(confirmation);
  });
});

app.post("/update-sku/:id", function(req, res) {
  let sku = {
    price: req.body.price
  };
  if (req.body.inventory)
    sku["inventory"] = { type: req.body.inventory.type }

  if (req.body.inventory && req.body.inventory.type === "finite")
    sku.inventory["quantity"] = +req.body.inventory.quantity;

  if (req.body.attributes)
    sku["attributes"] = req.body.attributes;

  stripe.skus.update(req.params.id, sku, function(err, success) {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});

app.post("/delete-sku/:id", function(req, res) {
  stripe.skus.del(req.params.id, function(err, confirmation) {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});

app.post("/delete-collection/:id", function(req, res) {
  rimraf(`./public/assets/collection-${req.params.id}`, function(err) {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});