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
			}
		};
	*/
	create: function(service={}) {
		if( "name" in service && 
			"path" in service &&
			"prefix" in service
		) {
			this._services[service.name] = service;

			/* Create connect to database */
			if("connect" in service) {
				db.createConnect(service.name, service.connect);
			}
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

		return {};
	}

};

/* Export */
module.exports = service;