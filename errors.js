/* Require error */
const error = require("./core/error.js");

/* SET ERROR CODE 1 - Service not found */
error.set(1, (request, response) => {
	response.status_code = 404;
	response.end(`Service not found`);
});

/* SET ERROR CODE 2 - Route not found */
error.set(2, (request, response) => {
	response.status_code = 404;
	response.end(`Route not found`);
});

/* SET ERROR CODE 3 - Middleware not function or not access */
error.set(3, (request, response) => {
	response.status_code = 400;
	response.end(`Middleware not function or not access`);
});

/* SET ERROR CODE 4 - Route value not function */
error.set(4, (request, response) => {
	response.status_code = 400;
	response.end(`Route value not function`);
});