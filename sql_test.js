// App Handling
const Express = require('express');
const app = Express();
// SQL connection handling
const MySQL = require('mysql2');


app.get('/getColors', (req, res) => {
	res.send('asdf');
});

app.post('/addColors', (req, res) => {
	res.send('hurgh');
});

const server = app.listen(process.env.PORT || 3000, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Listening to http:\/\/${host}/${port}`); 
});
