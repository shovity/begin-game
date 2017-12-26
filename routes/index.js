var express = require('express');
var router = express.Router();
var documents = require('../models/documents')

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('home', { title: 'Home', name: 'home'});
});

router.get('/documents', (req, res, next) => {
	documents.find({}, data => res.json(data))
})

module.exports = router;
