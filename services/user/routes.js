/* Require route */
const route = require("../../core/route.js");

/* Main page */
route.get("/", function() {
	console.log("User start");
});
route.get("/u", function() {
	console.log("User u");
});


/* Export */
module.exports = route;