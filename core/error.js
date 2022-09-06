/* Error */
const error = {
	_errors: {},
	req: {},
	res: {},

	/* Start */
	start: function(req, res) {
		this.req = req;
		this.res = res;
	},

	/* Set error */
	set: function(code, value) {
		this._errors[code] = value;
	},

	/* Call error */
	call: function(code) {
		if(code in this._errors) {
			this._errors[code](this.req, this.res);
		}
	},

};

/* Export */
module.exports = error;