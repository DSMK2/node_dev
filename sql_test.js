/* jshint esversion:6 */
// General
require('dotenv').config();
// App Handling
const Express = require('express');
const app = Express();
// SQL connection handling
const MySQL = require('mysql2');

app.get('/', (req, res) => {
	res.send("<p>Hello World!</p>");
});

app.get('/getColors', (req, res) => {
	let connection = MySQL.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
	
	connection.execute('SELECT * FROM `color_fun`', (err, results, fields) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');

		
		if(err)
			res.send(err);
		else if(results)
			res.send(results);
			
		//if(fields)
			//res.send(fields);
	});
	
	connection.end();
});

app.post(/addColor\/(rgb|hex)/, (req, res) => {
	let query = req.query;
	let params = req.params;
	params.hex = 'hex'
	// RGB and Hex is broken down to RGB values
	let R = -1;
	let G = -1;
	let B = -1;
	let post = {};
	let connection;
	
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');

	console.log(query, params);
	
	// RGB Handling
	if(typeof params.rgb !== 'undefined') {
		// Must have RGB values
		if(typeof query.r !== 'undefined' || typeof query.g !== 'undefined' || typeof query.b !== 'undefined') {
			let regexRGB = /[0-9]{1,3}/; // Match numbers
			
			if (regexRGB.test(query.r))
				R = parseInt(query.r);
			
			if (regexRGB.test(query.g))
				G = parseInt(query.g);
				
			if (regexRGB.test(query.b))
				B = parseInt(query.b);
		}
	// Hex Handling
	} else if (typeof params.hex !== 'undefined') {
		// Must have HEX value
		if(typeof query.hex !== 'undefined') {
			let regexHex = /#([0-9]|[A-F]){6}/;
			
			if(regexHex.test(query.hex)) {
				query.hex.replace('#', '');
				R = parseInt(query.hex.substring(0, 1), 16);
				G = parseInt(query.hex.substring(2, 3), 16);
				B = parseInt(query.hex.substring(4, 5), 16);
			}
		}
	}
	
	if(R === -1 || G === -1 || B === -1) {
		res.send('addColor: ' + params + ' failed with: ' + query);
		return;
	}
	
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
	
	connection.query('INSERT INTO `color_fun` VALUES SET ?', post, function(error, result, fields) {
		if(error)
			res.send(error)
			
		if(result)
			res.send(result);
	});
	
	connection.end();
});

const server = app.listen(process.env.PORT || 3000, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Listening to http:\/\/${host}/${port}`); 
});
