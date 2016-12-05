var LocalStrategy   = require('passport-local').Strategy;
const bcrypt = require("bcrypt-nodejs");
const xss = require('xss');

const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.user_collection;

module.exports = function(passport) {

//authenticate username and password



// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {

            done(null, user);

    });



    //Login page
    passport.use('local',new LocalStrategy(
    {
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
  function(req,username, password, done) {
           
      //hashed password
      let hash = bcrypt.hashSync(xss(password));
      
      users().then((userCollecion)=>{
            userCollecion.findOne({"profile.user_name":username}, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            userCollecion.findOne({"profile.password":password},function (err,password){
                 if (err) { return done(err); }
                  if (!password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            });
            
            return done(null, user);
         });
      
      });
      
      
  }
));


};