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

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
	extended: true
}));

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
	let data = req.body;
	let url_info = url.parse(req.url);
	let type;
	
	console.log(req.url);
	
	if(/hex/.test(url_info.pathname))
		type = 'hex';
	if(/rgb/.test(url_info.pathname))
		type = 'rgb';

	// RGB and Hex is broken down to RGB values
	let R = -1;
	let G = -1;
	let B = -1;
	let post = {};
	let connection;
	
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
	
	let query = connection.query('INSERT INTO `color_fun` SET ?', post, function(error, result, fields) {
		if(error)
			res.send(error);
			
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
