var express = require('express'),
    path = require('path'),
    jade = require('jade'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    compression = require('compression'),
    favicon = require('serve-favicon'),
    routes = require('./routes'),
    config = require('./config');

var app = express();

app.use(compression());
app.use(favicon(__dirname + '/public/img/favicon.ico',{
    maxAge:'30d'
}));
app.use(express.static(__dirname + '/public', {
    maxAge: '60d'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.use(morgan('dev'));
app.use(methodOverride());

if (!config.debug) {
    app.set('env', 'production');
    app.set('view cache', true);
}

routes(app);

app.listen(config.port, function () {
    console.log('listening on port %d in %s mode', config.port, app.settings.env);
});