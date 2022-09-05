/* Require http */
const http = require("http");

/* Require core */
const file = require("./file.js");

/* Require services */
const service = require("../services.js");

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
		let buffer, path;

		/* Сheck if route is a file */
		if(file.check(request.url)) {
			return file.connect(request, response);
		}

		/* Get service */
		buffer = service.get(request.url);

		/* Check service */
		if(!("name" in buffer)) {
			response.status_code = 404;
			return response.end(`Service not found`);
		}

		/* Check service routes exists */
		path = "services/"+buffer.path+"/routes.js";
		if(!file.exists(path)) {
			response.status_code = 404;
			return response.end(`Routes not found`);
		}

		/* Get service routes */
		const route = require("../"+path);
		console.log("Маршруты корректно не работают");

		/* Check if a route exists */
		path = request.url.replace(buffer.prefix, "");
		path = (!path) ? "/" : path;
		if(!route.checkExists(request.method, path)) {
			response.status_code = 404;
			return response.end(`Route not found`);
		}

		/* Get route value */
		buffer = route.getRoute(request.method, path);

		/* Check middleware */
		if(buffer.middlewares.length) {
			/* Call middlewares */
			server.callMiddlewares(buffer.middlewares, request, response);
		}

		/* Check route value */
		if(typeof buffer.value != "function") {
			response.status_code = 404;
			return response.end(`Function not found`);
		}

		/* Call route value */
		buffer.value(request, response);
		
		/* Response end */
		return response.end();
	},

	/* Call middlewares */
	callMiddlewares: function(middlewares, request, response) {

		/* Call middlewares */
		for(let i = 0; i < middlewares.length; i++) {

			/* Get middleware */
			let middleware = middlewares[i];

			/* Check middleware */
			if(typeof middleware != "function") {
				response.status_code = 404;
				return response.end(`Middleware not found`);
			}

			/* Check middleware */
			if(!middleware(request, response)) {
				response.status_code = 400;
				return response.end(`The middleware returned a false value`);
			}

		}

	}

};

/* Export */
module.exports = server;