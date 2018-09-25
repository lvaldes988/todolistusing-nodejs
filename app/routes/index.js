module.exports = function (app, passport, mysqldb) {
  
    // INITIALIZE MY AUTHENTICATION ROUTES
    require('./authentication')(app, passport);
  
    // INITIALIZE MY VIEWS ROUTES
    require('./views')(app, mysqldb);
     
    // INITIALIZE MYSQL
    // require('./mysql')(app, mysqldb);
  }