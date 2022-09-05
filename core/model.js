/* Require db */
const db = require("./db.js");

/* Model */
const model = {
	table: "",
	pkey: "",

	/*  Query
		return = {
			code: 0,
			content: "" / {} / [] / etc
		}
	*/
	_query: async function(sql, first=false) {
		let result;

		console.log(sql);
		result = await db.query(sql);

		if(result.code == 200) {
			result = {
				code: result.code,
				content: (first) ?
					result.content[0][0] : result.content[0]
			}
		}

		return result;
	},

	/*  SELECT
		arguments = {
			select:  [],
			join: 	 [] / {},
			where: 	 [],
			orderby: [],
			limit: 	 0,
			first: 	 true / false
		}
	*/
	get: async function(object = {}) {
		/* Variables */
		let result, data, sql;

		/* Data processing */
		data = this._data_processing("select", object);

		/* SQL constructor */
		sql = this._sql_constructor(data);

		/* Query */
		result = this._query(sql, data.first);

		return result;
	},

	/*  INSERT
		arguments = {
			fields: [],
			values: [] / {}
		}
	*/
	add: async function(object = {}) {
		/* Variables */
		let result, data, sql;

		/* Data processing */
		data = this._data_processing("insert", object);

		/* SQL constructor */
		sql = this._sql_constructor(data);

		/* Query */
		result = this._query(sql);

		return result;
	},

	/*  UPDATE
		arguments = {
			where: [],
			values: {}
		}
	*/
	update: async function(object={}) {
		/* Variables */
		let result, data, sql;

		/* Data processing */
		data = this._data_processing("update", object);

		/* SQL constructor */
		sql = this._sql_constructor(data);

		/* Query */
		result = this._query(sql);

		return result;
	},

	/*  DELETE
		arguments = {
			id: 0 / [],
			where: [],
			join: []
		}
	*/
	delete: async function(object={}) {
		/* Variables */
		let result, data, sql;

		/* Data processing */
		data = this._data_processing("delete", object);

		/* SQL constructor */
		sql = this._sql_constructor(data);

		/* Query */
		result = this._query(sql);

		return result;
	},

	/*  JOIN
		return = {
			table: "table_name",
			pkey:  "primary_key",
			ekey:  "external_key",
			type:  "join_type"
		}
	*/
	join: function(ekey, type="INNER") {
		return {
			table: this.table,
			pkey:  this.pkey,
			ekey:  ekey,
			type:  type
		};
	},

	/*  SQL constructor
		arguments = {
			type: 	 'select' / 'insert' / 'update' / 'delete',
			select:  [],
			join: 	 [] / {},
			where: 	 [],
			orderby: [],
			limit: 	 0,
			values:  [] / {},
			first: 	 true / false
		}
	*/
	_sql_constructor: function(object) {
		/* Variables */
		let sql, buffer = [],
			base 	= "",
			select 	= "",
			where 	= "",
			join 	= "",
			limit 	= "",
			orderby = "",
			values 	= "";

		/* Query type */
		switch(object.type) {

			/* SELECT */
			case "select":

				select = this._select_processing(object.select);

				base = `SELECT ${select} FROM ${this.table}`;

			break;

			/* INSERT */
			case "insert":

				select = "(" + this._select_processing(object.select) + ")";
				values = this._values_processing(object.values);

				base = `INSERT INTO ${this.table}${select}${values}`;

			break;

			/* UPDATE */
			case "update":

				values = this._set_processing(object.values);

				base = `UPDATE ${this.table}${values}`;

			break;

			/* DELETE */
			case "delete":

				if(Object.keys(object.join).length) {
					if(Array.isArray(object.join)) {
						buffer = object.join.map(j => j.table);
					} else {
						buffer.push(object.join.table);
					}
					buffer.unshift(this.table);
					select = " " + this._select_processing(buffer);
				}

				base = `DELETE${select} FROM ${this.table}`;

			break;

		}

		/* JOIN */
		join = this._join_processing(object.join);

		/* WHERE */
		where = this._where_processing(object.where);

		/* ORDER BY */
		if(object.orderby.length) {
			orderby = ` ORDER BY ${object.orderby[0]} ${object.orderby[1]}`;
		}

		/* LIMIT */
		if(object.limit) {
			limit = " LIMIT " + object.limit;
		}

		/* SQL */
		sql = `${base}${join}${where}${orderby}${limit}`;

		return sql;
	},

	/*  Data processing
		type = ""
		object = 0 / {}
	*/
	_data_processing: function(type, object) {
		let data = {
			type: 	type,
			select:  [],
			join: 	 [],
			where: 	 [],
			orderby: [],
			limit: 	 0,
			values:  []
		};

		if(Number.isFinite(parseInt(object))) {
			data.where = [this.pkey, object];
		} else {
			for(let key in data) {
				if(object[key]) {
					data[key] = object[key];
				}
			}
		}

		return data;
	},

	/*  Select processing
		select = [] 
	*/
	_select_processing: function(select) {
		if(!select.length) return "*";

		let result = "";

		for(let i = 0; i < select.length; i++) {
			result += `${select[i]}, `;
		}

		result = result.slice(0, -2);

		return result;
	},

	/*  Join processing
		join = [] / {}
	*/
	_join_processing: function(join) {
		if(!Object.keys(join).length) return "";

		let result = "";
		
		if(Array.isArray(join)) {
			for(let i = 0; i < join.length; i++) {
				result += ` ${join[i].type} JOIN ${join[i].table} ON ${this.table}.${this.pkey}=${join[i].table}.${join[i].ekey}`;
			}
		} else {
			result = ` ${join.type} JOIN ${join.table} ON ${this.table}.${this.pkey}=${join.table}.${join.ekey}`;
		}

		return result;
	},

	/*  Where processing
		where = [] */
	_where_processing: function(where) {
		if(!where.length) return "";

		let condition, cond, result = "";
		let array = ["and", "or", "AND", "OR"];
		let min_length;

		/* Multiple сonditions */
		if(Array.isArray(where[0])) {
			for(let i = 0; i < where.length; i++) {

				/* Cond */
				min_length = array.includes(where[i][0]) ? 3 : 2;
				cond = (where[i].length == min_length) ? "=" : where[i][min_length-1];

				/* First condition */
				if(!i) {
					result += ` WHERE ${where[i][0]}${cond}'${where[i][where[i].length - 1]}'`;
				}

				/* Subsequent conditions */
				else {

					/* Condition */
					if(array.includes(where[i][0])) {
						condition = ` ${where[i][0]} ${where[i][1]}`;
					}

					else {
						condition = ` AND ${where[i][0]}`;
					}

					result += `${condition}${cond}'${where[i][where[i].length - 1]}'`;
				}

			}

		/* One condition */
		} else {
			cond = (where.length == 2) ? "=" : where[1];
			result = ` WHERE ${where[0]}${cond}'${where[where.length - 1]}'`;
		}

		return result;
	},

	/*  Set processing
		set = {}
	*/
	_set_processing: function(set) {
		if(!Object.keys(set).length) return "";

		let result = "";

		for(let key in set) {
			result += `${key}='${set[key]}', `;
		}

		result = " SET " + result.slice(0, -2);

		return result;
	},

	/*  Values processing
		values = [] / {}
	*/
	_values_processing: function(values) {
		if(!Object.keys(values).length) return "";

		let result = "";

		/* Values is Array */
		if (Array.isArray(values)) {
			for(let i = 0; i < values.length; i++) {
				result += this._value_processing(values[i]) + ", ";
			}
			result = " VALUES " + result.slice(0, -2);
		}

		/* Values is Object */
		else if(typeof values == "object") {
			result = " VALUES " + this._value_processing(values);
		}

		return result;
	},

	/*  Value processing
		value = {}
	*/
	_value_processing: function(values) {
		let result = "";

		for(let key in values) {
			result += `'${values[key]}', `;
		}

		result = "(" + result.slice(0, -2) + "), ";

		return result.slice(0, -2);
	},

};

/* Export */
module.exports = model;