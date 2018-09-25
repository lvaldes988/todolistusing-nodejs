
var moment = require('moment');


module.exports = function (app, mysqldb) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function (req, res) {
    if (req.user) {
      res.redirect('/get-todos');
    }
    else {
      res.render('index.ejs'); // load the index.ejs file
    }
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/get-todos', isLoggedIn, function (req, res) {
    mysqldb.query(
      `SELECT * FROM todos WHERE uid='${req.user._id}'`, 
      function (error, results, fields) {

      if (error) throw error ;
      console.log(error)

      console.log('results: ', results);

      res.render('todos.ejs', {
        user: req.user,
        todos: results
      });
    });
  });

  app.post('/create-todo', isLoggedIn, function (req, res) {
    
    console.log('data ', req.body);

    var todo = {
      task: req.body.task,
      date: moment().format('YYYY/MM/DD'),
      complete: false,
      uid: req.user._id,
      due_date: moment().add(7, "days").format('YYYY/MM/DD')
    }

    mysqldb.query(
      `INSERT INTO todos(task, date, complete, uid, due_date) 
       VALUES('${todo.task}', '${todo.date}', ${todo.complete}, '${todo.uid}', '${todo.due_date}')`, 
      function (error, result, fields) {

        if (error) {
          console.log('error ', error);

          res.send({
            success: false,
            error: error,
            message: 'The todo was not created sorry :('
          });
        }
        else {
          // console.log('result: ', result);
          todo.id = result.insertId;

          res.send({
            success: true,
            todo: todo
          });
        }
    });

  });

  app.post('/delete-todo', function (req, res) {
    var id = req.body.id;

    mysqldb.query(
      `DELETE FROM todos WHERE id = ${id}`,
      function (error, result, fields) {

        if (error) {
          console.log('error ', error);

          res.send({
            success: false,
            error: error,
            message: 'The todo was not deleted :('
          });
        }
        else {
          console.log('result: ', result);
         
          res.send({
            success: true,
            id: id
          });
        }
      });

  });

  app.post('/update-todo', function (req, res) {
    var id = req.body.id;

    mysqldb.query(
      `UPDATE todos SET complete = true WHERE id = ${id}`,
      function (error, result, fields) {

        if (error) {
          console.log('error ', error);

          res.send({
            success: false,
            error: error,
            message: 'The todo was not updated :('
          });
        }
        else {
          console.log('result: ', result);

          res.send({
            success: true,
            id: id
          });
        }

      });
  });



  // app.get('/todos', isLoggedIn, function (req, res){
  //   res.render('todos.ejs', {
  //     user: req.user
  //   });
  // });
  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/password-recovery', function (req, res) {
    res.render('password-recovery.ejs', { message: req.flash('passwordRecoveryMessage') });
  });

  app.get('/password-reset', function (req, res) {
    res.render('password-reset.ejs', { message: req.flash('passwordResetMessage') });
  });

  app.get('/update-profile', isLoggedIn, function (req, res) {
    res.render('update-profile.ejs', {
      user: req.user,
      message: req.flash('updateProfileMessage')
    });
  });

  app.get('*', function (req, res) {
    res.render('404.ejs');
  });



};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    return next();
  } else {
    // if they aren't redirect them to the home page
    res.redirect('/');
  }
}


