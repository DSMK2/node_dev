// App Handling
const Express = require('express');
const app = Express();
// SQL connection handling
const MySQL = require('mysql2');
const Connection = MySQL.createConnection({
	host: 'mysql.ds-website.net',
	user: 'dsmk2',
	password: 'f#wag6',
	database: 'development_database'
});

app.get('/getColors', (req, res) => {
	try {
		Connection.execute('SELECT * FROM `color_fun`', (err, results, fields) => {
			/*
			console.log(err);
			console.log(results);
			console.log(fields);
			*/
			
			if(err)
				res.send(err);
			else
				res.send(results);
				
		});
		//Connection.end();
	} catch (e) {
		res.send('getColors: SQL connection failed' + e);
	}
});

app.post('/addColors', (req, res) => {
	res.send('hurgh');
});

const server = app.listen(3000, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Listening to http:\/\/${host}/${port}`); 
});

/*
try {
	console.log('Connecting');
	Connection.execute('INSERT INTO `color_fun` (`HEX`) values ("#8b8e89"),("#ffae00")', (err, results, fields) => {
		console.log(err);
		console.log(results);
		console.log(fields);
	});
	Connection.end();
} catch(error) {
	console.log(error);
}
*/