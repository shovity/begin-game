var au4k = require('./js/au4k'),
  puzme = require('./js/puzme')

// Require css
require('./css/master.css')
if (location.pathname == '/') require("./css/home.css")

/**
 * Au4k
 */
if (/^\/games\/au4k/.test(location.pathname)) au4k()

/**
 * Puzme
 */
if (/^\/games\/puzme/.test(location.pathname)) puzme()
