const express = require('express');
const router = express.Router();
var path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User
const Employee  = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login page
router.get('/login', (req, res) => 
res.render('login'));


router.get('/register', (req, res) => 
res.render('register'));

// admin page
router.get('/admin', ensureAuthenticated, (req, res) =>
  res.render('admin', {
    user: req.user
  })
);


// manager page
router.get('/manager', ensureAuthenticated, (req, res) =>
  res.render('manager', {
    user: req.user
  })
);

// coordinator page
router.get('/coordinator', ensureAuthenticated, (req, res) =>
  res.render('coordinator', {
    user: req.user
  })
);

// trainee page
router.get('/trainee', ensureAuthenticated, (req, res) =>
  res.render('trainee', {
    user: req.user
  })
);

// trainer page
router.get('/trainer', ensureAuthenticated, (req, res) =>
  res.render('trainer', {
    user: req.user
  })
);




// Register-delete this 
router.post('/register', (req, res) => {
    const { empFirstName, empno, empRole, password, empConfirmPassword } = req.body;
    let errors = [];
  
    if (!empFirstName || !empno || !empRole || !password || !empConfirmPassword) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password!= empConfirmPassword) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        empFirstName, 
        empno, 
        empRole, 
        password, 
        empConfirmPassword 
      });
    } else {
      Employee.findOne({ empno: empno }).then(employee => {
        if (employee) {
          errors.push({ msg: 'user already exists' });
          res.render('register', {
            errors,
            empFirstName, 
            empno, 
            empRole, 
            password, 
            empConfirmPassword 
          });
        } // bycript
        else {
          const newEmployee = new Employee({
            empFirstName,
            empno,
            empRole,
            password
          });
          //hash mapping
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newEmployee.password, salt, (err, hash) => {
              if (err) throw err;
              newEmployee.password = hash;
              newEmployee
                .save()
                .then(employee => {
                  //flash stores in a session and redirects when it is redirected 
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });
  
  

//calling passport for authenetication- login 
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, employee, info) {
    if (err) { return next(err); 
     }
    if (!employee) {
   
      req.flash(
        'error_msg',
        'Wrong Credentials'
      );
  
      return res.redirect('/users/login');    }
    req.logIn(employee, function(err) {
      if (err) { 
        
        return next(err); }


     

      if(req.user.empRole === "admin"){
      
           res.redirect('/users/admin');
            }
      if(req.user.empRole === "manager"){

        
              res.redirect('/users/manager');
    }

      if(req.user.empRole === "coordinator"){
  
       res.redirect('/users/coordinator');
    }
 
      if(req.user.empRole === "trainee"){
      res.redirect('/users/trainee');
    }
    if(req.user.empRole === "trainer"){
      res.redirect('/users/trainer');
    }
    });
  })(req, res, next);
});







// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;