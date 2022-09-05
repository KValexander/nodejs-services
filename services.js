/* Require service */
const service = require("./core/service.js");

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
service.create({
	name: "content",
	path: "content/",
	prefix: "/content",
	connect: {
		host: "localhost",
		user: "root",
		password: "root",
		database: ""
	},
});
service.create({
	name: "user",
	path: "user/",
	prefix: "/user",
	connect: {
		host: "localhost",
		user: "root",
		password: "root",
		database: ""
	},
});


/* Export */
module.exports = service;