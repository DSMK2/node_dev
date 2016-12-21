// General
require('dotenv').config();
// App Handling
const Express = require('express');
const app = Express();
// SQL connection handling
const MySQL = require('mysql2');

app.get('/', (req, res => {
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
		//if(err)
			//res.send(err);
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
		if(results)
			res.send(results);
			
		//if(fields)
			//res.send(fields);
	});
	
	connection.end();
});

app.post('/addColors', (req, res) => {
	res.send('hurgh');
});

const server = app.listen(process.env.PORT || 3000, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Listening to http:\/\/${host}/${port}`); 
});
