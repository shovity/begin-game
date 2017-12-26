var express = require('express')
var router = express.Router()


/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('home', { title: 'Home', name: 'home'})
})

/* GET caro page. */
router.get('/caro', function(req, res, next) {
  res.render('games/caro', { title: 'Canoro', name: 'caro' })
})

/* GET plane page. */
router.get('/plane', function(req, res, next) {
  res.render('games/plane', { title: 'Plane', name: 'plane' })
})

/* GET au4k page */
router.get('/au4k', (req, res, next) => {
	res.render('games/au4k', { title: 'Au4k' })
})

/* GET puzme page */
router.get('/puzme', (req, res, next) => {
	res.render('games/puzme', { title: 'Puzme' })
})

module.exports = router
