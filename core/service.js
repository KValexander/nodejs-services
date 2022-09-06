/* Require file */
const file = require("./file.js");

/* Reqiure db */
const db = require("./db.js");

/* Service */
const service = {
	_services: {},

	/*  Create service
		arguments = {
			name: service name,
			path: path to the root of the service from the services folder
			prefix: prefix for routes,
			connect: { database connection data
				host: "",
				user: "",
				password: "",
				database: ""
			},
		};
	*/
	create: function(service={}) {
		if( "name" in service && 
			"path" in service &&
			"prefix" in service
		) {
			/* Default values */
			service.routes = {};

			/* Create connect to database */
			if("connect" in service) {
				db.createConnect(service.name, service.connect);
			}

			/* Get routes */
			path = "services/"+service.path+"/routes.js";
			if(file.exists(path)) {
				service.routes = require("../"+path).getRoutes();
			}

			/* Add service */
			this._services[service.name] = service;
		}
	},

	/* Get service */
	get: function(url) {
		let regex;
		for(let key in this._services) {
			regex = new RegExp(`^(${this._services[key].prefix}?).*`);
			if(regex.test(url)) {

				/* Select db connection */
				db.select(key);

				/* Return service */
				return this._services[key];

			}
		}
	},

	/* Get route */
	getRoute: function(service, url, method="GET") {
		let route;
		
		route = url.replace(service.prefix, "");
		route = (!route) ? "/" : route;

		return service["routes"][method][route];
	}

};

/* Export */
module.exports = service;