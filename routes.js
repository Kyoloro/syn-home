module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/intro', function (req, res) {
        res.render('ppt');
    });
    app.get('/warn', function (req, res) {
        res.render('warn');
    });
    app.get('*', function (req, res) {
        res.redirect('/')
    });
};