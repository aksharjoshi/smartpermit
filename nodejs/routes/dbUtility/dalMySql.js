var DB =  require("./dbConnect.js")

module.exports = function(collection, dbName){
	this.collection = collection;
	this.connection = DB(dbName);

	/*this.connection.query("SET @@session.time_zone = '+00:00'", function (e, d) {
		console.log("Set timezone to +00:00", e);
	})
*/

	/**
	 * Finds row by the criteria passed and the limit from the database
	 * @param conditions {JSON obj} the condition criteria {eml:'test@gmail.com'}, support only equals
	 * @param selectCols {String} the select parameters 'usr_id, email'
	 * @param range {JSON obj} the time duration criteria 
	 * @param limit {int} the limit to decide row count, default
	 * @param offset {int} the offset to decide start row, default
	 * @param sort {JSON obj} the sorting attributes {id: -1}
	 * @param callBack {function} the callback function
	 */
	this.find = function (qs, /*conditions, selectCols, range, limit, offset, sort,*/ callBack) {
		/*var isWhereSet = false;
		var data = [];
		var qs = "SELECT " + selectCols + " FROM " + this.collection;
		if (conditions && !Utils.isEmpty(conditions)) {
			qs += " WHERE " + Utils.getConditionsString(conditions);
			isWhereSet = true;
		};
		if (range && !Utils.isEmpty(range)) {
			qs += (isWhereSet == false)? " WHERE " : " AND ";
			if(range.min){
				qs += range.field + " >=  ?";
				data.push(range.min);
				if (range.max) {
					qs += " AND ";
				};
			}
			if (range.max) {
				qs += range.field + " <=  ?";
				data.push(range.max);				
			};
		};
		if (sort && !Utils.isEmpty(sort)) {
			qs += " ORDER BY " + Utils.getSortString(sort);
		};
		if (limit && limit > 0) {
			qs += " LIMIT " + limit;
		};
		if (offset && offset > 0) {
			qs += " OFFSET " + offset;
		};		*/

		console.log("qs ", qs);

		this.connection.query(qs, data, function (err, rows, fields) {
			callBack(err, rows, fields);
		})
	}

}
/*
var Utils = {
	getConditionsString: function (conditions) {
		var cndStr = ''
		for(var v in conditions) {
			if (conditions[v] instanceof Array) {
				cndStr += '('
				for(var item in conditions[v]){
					if (cndStr != '' && cndStr != '(') {
						cndStr += " OR ";
					};
					cndStr += v;
					cndStr += " = ";
					cndStr += (typeof conditions[v][item] == "string")? "'"+conditions[v][item]+"'": conditions[v][item];					
				}
				cndStr += ')'
			}
			else {
				if (cndStr != '') {
					cndStr += " AND ";
				};
				cndStr += v;
				cndStr += " = ";
				cndStr += (typeof conditions[v] == "string")? "'"+conditions[v]+"'": conditions[v];
			}
		}
		return cndStr;
	},
	getSortString: function (sort) {
		var srtStr = ''
		for(var v in sort) {
			if (srtStr != '') {
				srtStr += ", ";
			};
			srtStr += v + " "+ (sort[v] == -1 ? "DESC" : "ASC");
		}
		return srtStr;
	},
	isEmpty: function (obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	},

	timeFilterForTables: function(time_frame, time_field){
		var range = "";
		switch(time_frame){
			case "1":
				range = time_field + " " + "BETWEEN NOW() - INTERVAL 1 HOUR AND NOW() ORDER BY " + time_field + " DESC";
			break;

			case "24":
				range = time_field + " " + "BETWEEN NOW() - INTERVAL 1 DAY AND NOW() ORDER BY " + time_field + " DESC";
			break;

			case "168":
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())) - INTERVAL 6 DAY AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1) ORDER BY " + time_field + " DESC";
			break;

			case "672": 
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())) - INTERVAL 27 DAY AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1) ORDER BY " + time_field + " DESC";
			break;

			case "8760":
				//range = "YEAR(" + "`"+ time_field + "`" + ") = YEAR(CURDATE())";
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE())-1, DAYOFYEAR(CURDATE())+1) AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1) ORDER BY " + time_field + " DESC";
			break;
			default :
			console.log("time_frame",time_frame);
		}
		return range;
	},

	columnSelection: function(time_frame, time_field){
		var selectCols = "";
		switch(time_frame){
			case "1":
				selectCols = "from (SELECT *, CONCAT(CONCAT(HOUR(`" + time_field + "`), ':'),(MINUTE(`" + time_field + "`) - (MINUTE(`" + time_field + "`)%10))) AS TIME_FRAME";
			break;

			case "24":
				selectCols = "from (SELECT *, CONCAT(HOUR(`" + time_field + "`), ':00') AS TIME_FRAME";
			break;

			case "168":
				selectCols = "from (SELECT *, CONCAT(CONCAT(DATE_FORMAT(`" + time_field + "`, '%m'), '/'),DAY(`" + time_field + "`)) AS TIME_FRAME";
			break;

			case "672": 
				selectCols = "from (SELECT *, CONCAT('WK ', WEEK(`" + time_field + "`)- WEEK(NOW() - INTERVAL 27 DAY)) AS TIME_FRAME";
			break;

			case "8760":
				selectCols = "from (SELECT *, CONCAT(LEFT(MONTHNAME(`" + time_field + "`), 3),CONCAT(',',DATE_FORMAT(`" + time_field + "`, '%y'))) AS TIME_FRAME";
			break;
			default :
			console.log("time_frame", time_frame);
		}
		return selectCols;
	},

	timeFilter: function(groupByCondition, time_frame, time_field){
		var range = "";
		switch(time_frame){
			case "1":
				range = time_field + " " + "BETWEEN NOW() - INTERVAL 1 HOUR AND NOW()) AS temp GROUP BY TIME_FRAME," + groupByCondition + " ORDER BY " + time_field;
			break;

			case "24":
				range = time_field + " " + "BETWEEN NOW() - INTERVAL 1 DAY AND NOW()) AS temp GROUP BY TIME_FRAME," + groupByCondition + " ORDER BY " + time_field;
			break;

			case "168":
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())) - INTERVAL 6 DAY AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1)) AS temp GROUP BY TIME_FRAME," + groupByCondition + " ORDER BY " + time_field;
			break;

			case "672": 
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())) - INTERVAL 27 DAY AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1)) AS temp GROUP BY TIME_FRAME," + groupByCondition + " ORDER BY " + time_field;
			break;

			case "8760":
				//range = "YEAR(" + "`"+ time_field + "`" + ") = YEAR(CURDATE())";
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE())-1, DAYOFYEAR(CURDATE())+1) AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1)) AS temp GROUP BY TIME_FRAME," + groupByCondition + " ORDER BY " + time_field;
			break;
			default :
			console.log("time_frame",time_frame);
		}
		return range;
	},

// Code by Akshar 09/28/2016 starts here
	timeFilterWithoutGroupBy: function(time_frame, time_field){
		var range = "";
		switch(time_frame){
			case "1":
				range = time_field + " " + "BETWEEN NOW() - INTERVAL 1 HOUR AND NOW()) AS temp ORDER BY " + time_field;
			break;

			case "24":
				range = time_field + " " + "BETWEEN NOW() - INTERVAL 1 DAY AND NOW()) AS temp ORDER BY " + time_field;
			break;

			case "168":
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())) - INTERVAL 6 DAY AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1)) AS temp ORDER BY " + time_field;
			break;

			case "672": 
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())) - INTERVAL 27 DAY AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1)) AS temp ORDER BY " + time_field;
			break;

			case "8760":
				//range = "YEAR(" + "`"+ time_field + "`" + ") = YEAR(CURDATE())";
				range = time_field + " " + "BETWEEN MAKEDATE(YEAR(CURDATE())-1, DAYOFYEAR(CURDATE())+1) AND MAKEDATE(YEAR(CURDATE()), DAYOFYEAR(CURDATE())+1)) AS temp ORDER BY " + time_field;
			break;
			default :
			console.log("time_frame",time_frame);
		}
		return range;
	}
// Code by Akshar 09/28/2016 ends here

}*/