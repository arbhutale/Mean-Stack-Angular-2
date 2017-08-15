const User  = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router)=>{
  /* ==============
     Register Route
  ============== */
  router.post('/register', (req, res) => {
    // Check if email was provided
    if (!req.body.email) {
      res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
    } else {
      // Check if username was provided
      if (!req.body.username) {
        res.json({ success: false, message: 'You must provide a username' }); // Return error
      } else {
        // Check if password was provided
        if (!req.body.password) {
          res.json({ success: false, message: 'You must provide a password' }); // Return error
        } else {
          // Create new user object and apply user input
          let user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
          });
          // Save user to database
          user.save((err) => {
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the username field
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); // Return error
                      } else {
                        res.json({ success: false, message: err }); // Return any other error not already covered
                      }
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                }
              }
            } else {
              res.json({ success: true, message: 'Acount registered!' }); // Return success
            }
          });
        }
      }
    }
  });

  router.get('/checkEmail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided' }); // Return error
    } else {
      // Search for user's e-mail in database;
      User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
          } else {
            res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
          }
        }
      });
    }
  });

  router.get('/checkUsername/:username', (req, res) => {
    // Check if username was provided in paramaters
    if (!req.params.username) {
      res.json({ success: false, message: 'Username was not provided' }); // Return error
    } else {
      // Look for username in database
      User.findOne({ username: req.params.username }, (err, user) => {
        // Check if connection error was found
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's username was found
          if (user) {
            res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
          } else {
            res.json({ success: true, message: 'Username is available' }); // Return as vailable username
          }
        }
      });
    }
  });

  router.post('/login',(req,res)=>{
    if(!req.body.username){
      res.json({ success: false, message:"No User Name was Provided"});
    }else{
      if(!req.body.password){
        res.json({ success: false, message:"Password is Empty"});
      }else{
        User.findOne({username:req.body.username.toLowerCase()},(err, user)=>{
          if(err){
            res.json({ success: false, message: err});
          }else{
            if(!user){
              res.json({ success: false, message: "Username not found"});
            }
            else{
              const validPassword = user.comparePassword(req.body.password);
              if(!validPassword){
                res.json({ success: false, message: 'Password invalid'});
              }else{
                const token = jwt.sign({ userId: user._id }, config.secret,{ expiresIn: '24h'});
                res.json({success: true, message: 'login success',token: token, user: { username:user.username}});
              }
            }
          }
        });
      }
    }
  });


 router.use((req, res, next) =>{ 
   const token = req.headers['authorization'];
   if(!token){
     res.json({success: false, message:'No Token Provided'});
   }else{
     jwt.verify(token,config.secret, (err, decoded)=>{
       if(err){
         res.json({success: false, message:'Token invalid' + err});
       }else{
         req.decoded = decoded;
         next();
       }
     });
   }  
 });


router.get('/profile', (req, res) => {
  // Search for user in database
  User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
    // Check if error connecting
    if (err) {
      res.json({ success: false, message: err }); // Return error
    } else {
      // Check if user was found in database
      if (!user) {
        res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
      } else {
        res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
      }
    }
  });
});
    return router;
}