const app = require('./index.js');
const fs = require('fs-extra');
const multer = require('multer');
const path = require('path');
const sizeOf = require('image-size');

// reading in our store config file
app.get('/config', function(req, res) {
  const config = fs.readFile("./src/assets/store_config.json", 'utf8', (err, data) => {
    res.json(JSON.parse(data));
  })
});

// updating the store config file, this is used in the /config route
app.post('/config', function(req, res) {
  const config = fs.writeFile("./src/assets/store_config.json", JSON.stringify(req.body), 'utf8', (err, data) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ success: true });
    }
  })
});

app.get('/about-text', function(req, res) {
  const config = fs.readFile("./src/assets/about-text.txt", 'utf8', (err, data) => {
    if (err)
      res.json({ error: err });
    else
      res.json(JSON.parse(data));
  })
});
app.post('/about-text', function(req, res) {
  const config = fs.writeFile("./src/assets/about-text.txt", JSON.stringify(req.body.text), 'utf8', (err, data) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ success: true });
    }
  })
});

// uploading image files for products & collections
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let type = req.params.type;
      let path = `./public/assets/${type}`;
      fs.mkdirsSync(path);
      callback(null, path);
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    }
  })
});

app.post("/upload-image/:type",
  upload.single("file"), (req, res) => {
    sizeOf(req.file.path, function(err, dimensions) {
      res.json({
        success: true,
        width: dimensions.width,
        height: dimensions.height
      })
    });
  }
);
app.get("/delete-image/:product_id/:photo_name", function(req, res) {
  fs.unlink(`./public/assets/${req.params.product_id}/${req.params.photo_name}`, (err) => {
    err ? res.status(500).send(err) : res.json({ success: true });
  });
});