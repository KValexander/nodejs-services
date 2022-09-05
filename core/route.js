/* Route */
const route = {

	/* Route groups */
	_groups: [],

	/* Current route */
	_current: {
		method: null,
		route: null
	},

	/* Routes */
	_routes: {
		GET: {},
		POST: {}
	},

	/* Checking if a route exists */
	checkExists: function(method, route) {

		if(!(method in this._routes)) {
			return false;
		}

		return (route in this._routes[method]);
	},

	/* Get route value */
	getRoute: function(method, route) {
		if(!(method in this._routes)) {
			return {};
		}

		if(!(route in this._routes[method])) {
			return {};
		}

		return this._routes[method][route];
	},

	/* Route group */
	group: function(group, callback) {
		this._groups.push({
			group: group[0],
			value: group[1]
		});

		callback();

		this._groups.pop();

		return this;
	},

	/* Add route */
	add: function(method, route, value) {
		
		/* Add route */
		this._routes[method][route] = {
			value: value,
			middlewares: []
		};

		/* Current route */
		this._current = {
			method: method,
			route: route
		};

		/* Assigning a route to a group */
		if(this._groups.length) {
			for(let i = 0; i < this._groups.length; i++) {
				this[this._groups[i].group](this._groups[i].value);
			}
		}

		return this;
	},

	/* Route with type get */
	get: function(route, value) {
		this.add("GET", route, value);
		return this;
	},

	/* Route with type post */
	post: function(route, value) {
		this.add("POST", route, value);
		return this;
	},

	/* Adding middleware to a route */
	middleware: function(value) {
		this._routes[this._current.method][this._current.route].middlewares.push(value);
		return this;
	}
};

/* Export */
module.exports = route;