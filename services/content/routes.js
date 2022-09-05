/* Require route */
const route = require("../../core/route.js");

/* Main page */
route.get("/", function() {
	console.log("Content start");
});
route.get("/c", function() {
	console.log("Content c");
});


/* Export */
module.exports = route;