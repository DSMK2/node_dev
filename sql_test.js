/* jshint esversion:6 */
// General
require('dotenv').config();
// App Handling
const Express = require('express');
const app = Express();
// SQL connection handling
const MySQL = require('mysql2');
// Misc Libraries
const url = require('url');
const BodyParser = require('body-parser');

/**
* @function extend
* @description Light function that creates an object 
* @param object default_ Object containing "default" values, if the options object doesn't have the default value prop, the default_ prop is used instead
* @param object options Object containing values to override defaults, properties must match defaults to be used
* @returns object Object with either or default/option values
*/
function extend(default_, options) {
	let prop;
	let result = {};
	
	for(prop in default_) {
		if(options.hasOwnProperty(prop))
			result[prop] = options[prop];
		else
			result[prop] = default_[prop];
	}
	
	return result;
}

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
	extended: true
}));

app.get('/', (req, res) => {
	res.send("<p>Hello World!</p>");
});

app.get('/getColors', (req, res) => {
	
	let defaults = {from, to};
	let data = req.body;
	let query;
	
	data = extend(defaults, data);
	
	let connection = MySQL.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
	
	query = connection.query('SELECT * FROM `color_fun`' + (typeof data.from !== 'undefined' && typeof data.to !== 'undefined' ? ' LIMIT ?, ?' : ''), [data.from, (data.to-data.from)], (err, results, fields) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');

		
		if(err) {
			res.status(500);
			res.send(err);
		} else if(results) {
			res.status(200);
			res.send(results);
		}
		//if(fields)
			//res.send(fields);
	});
	
	console.log(query);
	
	connection.end();
});

app.get('/getColors/average', (req, res) => {
	let defaults = {from, to};
	let data = req.body;
	let query;
	
	data = extend(defaults, data);
	
	let connection = MySQL.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
	
	connection.execute('SELECT AVG(`R`) AS `R`, AVG(`G`) AS `G`, AVG(`B`) AS `B` FROM `color_fun` GROUP BY R, G, B'), (err, results, fields) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');

		
		if(err) {
			res.status(500);
			res.send(err);
		} else if(results) {
			res.status(200);
			res.send(results);
		}

	});
	
	
	connection.end();
}

app.post(/addColor\/(rgb|hex)/, (req, res) => {
	let data = req.body;
	let url_info = url.parse(req.url);
	let type;
	let query;

	// RGB and Hex is broken down to RGB values
	let R = -1;
	let G = -1;
	let B = -1;
	let post = {};
	let connection;
	
	if(/hex/.test(url_info.pathname))
		type = 'hex';
	if(/rgb/.test(url_info.pathname))
		type = 'rgb';
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');

	console.log('addColor', data.r, data.g, data.b, data.hex, url_info, type);
	
	// RGB Handling
	if(type === 'rgb') {
		// Must have RGB values
		if(typeof data.r !== 'undefined' || typeof data.g !== 'undefined' || typeof data.b !== 'undefined') {
			let regexRGB = /[0-9]{1,3}/; // Match numbers
			
			if (regexRGB.test(data.r))
				R = parseInt(data.r);
			
			if (regexRGB.test(data.g))
				G = parseInt(data.g);
				
			if (regexRGB.test(data.b))
				B = parseInt(data.b);
		}
	// Hex Handling
	} else if (type === 'hex') {
		// Must have HEX value
		if(typeof data.hex !== 'undefined') {
			let regexHex = /#([0-9]|[a-f]){6}/i;
			
			if(regexHex.test(data.hex)) {
				data.hex = data.hex.replace('#', '');
				R = parseInt(data.hex.substring(0, 2), 16);
				G = parseInt(data.hex.substring(2, 4), 16);
				B = parseInt(data.hex.substring(4, 6), 16);
				console.log('Hex: ' + data.hex + ' ' + R + ' ' + G + ' ' + B);
			}
		}
	}
	
	if(R === -1 || G === -1 || B === -1) {
		console.log('addColor Failed: No valid values for RGB found');
		res.send('addColor: ' + 'asdf' + ' failed with: ' + query);
		return;
	} else 
		console.log('addColor Success: Attempting SQL insert');
	
	//res.send('addColor: ' + params + ' succeeded with: ' + query);
	
	connection = MySQL.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
	
	post.R = R;
	post.G = G;
	post.B = B;
	
	query = connection.query('INSERT INTO `color_fun` SET ?', post, function(error, result, fields) {
		if(error) {
			res.status(500);
			res.send(error);
		}
			
		if(result) {
			res.status(200);
			res.send(result);
		}
	});
	console.log(query);
	connection.end();
});

const server = app.listen(process.env.PORT || 3000, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Listening to http:\/\/${host}/${port}`); 
});
