const express = require('express'),
  fs = require('fs'),
  path = require('path')

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({'this': 'awsome api'})
});

router.get('/puzme/random-image', (req, res, next) => {
  fs.readdir(path.join(__dirname, '/../public/images/puzme'), (err, files) => {
    if (err) {
      console.log(err);
      res.end('erro')
    } else {

      var r = Math.floor(Math.random() * files.length);
      fs.readFile(path.join(__dirname, '/../public/images/puzme', files[r]), (err, file) => {
        if (err) {
          console.log(err);
          res.end('erro')
        } else {
          res.end(file)
        }
      })
    }
  })
})

module.exports = router;
