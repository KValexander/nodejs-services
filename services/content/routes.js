/* Require route */
const route = require("../../core/route.js");

/* Main page */
route.get("/", function(req, res) {
	console.log("Content start");
});

/* C page */
route.get("/c", function() {
	console.log("Content c");
});


/* Export */
module.exports = route;