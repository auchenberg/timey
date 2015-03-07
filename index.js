var express = require('express');
var app = express();
var lessMiddleware = require('less-middleware');

app.engine('ejs', require('ejs-locals'));

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(lessMiddleware(__dirname + '/assets', {
    force: true
}));

app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(app.get('port'), function(){
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});