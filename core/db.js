/* Require mysql2 */
const mysql = require("mysql2");

/* DB */
const db = {
	_connections: {},
	_current: null,

	/* Create a database connection */
	createConnect: function(name, data) {
		/*  Connection to database
			arguments = {
				host: "",
				user: "",
				password: "",
				database: ""
			}
		*/
		const connect = mysql.createConnection(data);

		/* Check connection */
		connect.connect(err => {
			if(err) {
				console.log(`Error: ${err.message}`);
			} else {
				this._connections[name] = connect;
				this._current = connect;
				console.log("Mysql database connection established");
			}
		});

	},

	/* Select current connection */
	select: function(name) {
		if(name in this._connections) {
			this._current = this._connections[name];
		}
	},

	/* Execute query */
	query: async function(sql) {
		let result;

		/* Request execution */
		try {
			result = {
				code: 200,
				content: await this._current.promise().query(sql)
			}
		}

		/* Catching errors */
		catch(err) {
			result = {
				code: 400,
				content: err
			}
		}

		/* Returning a result */
		return result;
	},

	/* Execute query */
	execute: async function(sql) {
		let result;

		/* Request execution */
		try {
			result = {
				code: 200,
				content: await this._current.execute(sql)
			}
		}

		/* Catching errors */
		catch(err) {
			result = {
				code: 400,
				content: err
			};
		}

		/* Returning a result */
		return result;
	},


};

/* Export */
module.exports = db;