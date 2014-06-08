var express = require('express');
var app = express();

app.configure(function(){

	app.engine('ejs', require('ejs-locals'));
	app.set('port', process.env.PORT || 8000);
	app.use(express.static(__dirname));

});

app.listen(app.get('port'), function(){
 	console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});