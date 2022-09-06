/* Require http */
const http = require("http");

/* Require core */
const file = require("./file.js");
const error = require("./error.js");

/* Require services */
const service = require("../services.js");

/* Require errors */
require("../errors.js");

/* Server */
const server = {

	/* Server start */
	start: (host="localhost", port=80) => {

		/* Create server */
		http.createServer(server.processing)

		/* Start server */
		.listen(port, host, () => {
			console.log(`Server is running on http://${host}:${port}`)
		});

	},

	/* Processing request */
	processing: function(request, response) {
		let serv, route;

		/* Сheck if route is a file */
		if(file.check(request.url)) {
			return file.connect(request, response);
		}

		/* Start error handle */
		error.start(request, response);

		/* Get service */
		serv = service.get(request.url);

		/* Check service */
		if(!serv) {
			return error.call(1); // ERROR CODE 1
		}

		/* Get route */
		route = service.getRoute(serv, request.url, request.method);

		/* Check route */
		if(!route) {
			return error.call(2); // ERROR CODE 2
		}

		/* Call route */
		server.callRoute(route, request, response);
		
		/* Response end */
		return response.end();
	},

	/* Call route */
	callRoute: function(route, request, response) {

		/* Call middlewares */
		if(!server.callMiddlewares(route.middlewares, request, response)) {
			return error.call(3); // ERROR CODE 3
		}

		/* Check route value */
		if(typeof route.value != "function") {
			return error.call(4); // ERROR CODE 4
		}

		/* Call route value */
		route.value(request, response);

	},

	/* Call middlewares */
	callMiddlewares: function(middlewares, request, response) {
		if(!middlewares.length) return true;

		/* Call middlewares */
		for(let i = 0; i < middlewares.length; i++) {

			/* Get middleware */
			let middleware = middlewares[i];

			/* Check middleware */
			if(typeof middleware != "function") {
				return false;
			}

			/* Check middleware */
			if(!middleware(request, response)) {
				return false;
			}

		}

		return true;
	}

};

/* Export */
module.exports = server;