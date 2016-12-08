const express = require('express');
const router = express.Router();
const data = require("../data");
const mealData = data.meal_collection;
const userData = data.user_collection;
const commentData = data.comments;
var passport = require('passport');
const bcrypt = require("bcrypt-nodejs");
const xss = require('xss');



const uuid = require('node-uuid');

//list of result meals
    let breakfastList=[];
    let lunchList= [];
    let dinnerList = [];
    let snackList = [];

//welcome Page
router.get("/", (req, res) => {
    let loginMessage = req.flash('loginMessage');

     res.render('websiteLayout/welcomepage',{ message: loginMessage  });

});
//login
router.get("/login", (req, res) => {
    let loginMessage = req.flash('loginMessage');

     res.render('websiteLayout/login',{ message: loginMessage  });

});

//sign up 
router.get("/signup", (req, res) => {
    let loginMessage = req.flash('loginMessage');

     res.render('websiteLayout/signup',{ message: loginMessage  });

});

//Logout
router.get('/logout', function(req, res) {
    console.log("indise logout");
        req.logout();
        res.render('websiteLayout/welcomepage');
    });



router.get("/editProfile", (req, res) => {
    userData.getUserById(xss(req.user._id)).then((user) => {
        res.render("websiteLayout/editProfile",{ user: user });
    }).catch(() => {
        res.render("websiteLayout/meal-user",{ error: "User Not Found"});
    });

});


router.post('/login',
  passport.authenticate('local', { successRedirect: '/meal_collection/editProfile',
                                   failureRedirect: '/meal_collection/login',
                                   failureFlash: true
                                   })
);

//signup post
router.post("/signup", (req, res) => {
    //hashed password
      let hashpassword = bcrypt.hashSync(xss( req.body.password));

      let name = xss(req.body.name);
      let username = xss(req.body.username);
      let weight = xss(req.body.weight);
      let height =xss(req.body.height);
      let age = xss(req.body.age);
      
      if (!name && !username && !req.body.password && !weight && !height && !age) {
        res.render('websiteLayout/signup',{ errorMessage: "You must provide data to create a user"  });
        return;
    }

    if (name===undefined) {
        res.render('websiteLayout/signup',{ errorMessage: "You must provide a name"  });
        return;
    }

    if (username ===undefined) {
        res.render('websiteLayout/signup',{ errorMessage: "You must provide a user name"  });
        return;
    }

    if (req.body.password ===undefined) {
        res.render('websiteLayout/signup',{ errorMessage: "You must provide a password"  });
        return;
    }

    if (weight ===undefined) {
        res.render('websiteLayout/signup',{ errorMessage: "You must provide a weight"  });
        return;
    }
    if (isNaN(weight)) {
        res.render('websiteLayout/signup',{ errorMessage: "Your weight must be a number"  });
        return;
    }

    if (height ===undefined) {
        res.render('websiteLayout/signup',{ errorMessage: "You must provide a height"  });
        return;
    }
    if (isNaN(height)) {
        res.render('websiteLayout/signup',{ errorMessage: "Your height must be a number"  });
        return;
    }

    if (age===undefined) {
        res.render('websiteLayout/signup',{ errorMessage: "You must provide an age"  });
        return;
    }
    if (isNaN(age)) {
        res.render('websiteLayout/signup',{ errorMessage: "Your age must be a number"  });
        return;
    }

    userData.addUserProfile(name,username,hashpassword,weight,height,age)
        .then((newUser) => {

                res.redirect('/meal_collection/login');
        }).catch((error) => {
        res.render('websiteLayout/signup',{ errorMessage: error  });
    });
});

//edit profile post
router.post("/editProfile", (req, res) => {
    let userInfo = req.body;

     if (!xss(userInfo.vegetarian)) {
        res.render("websiteLayout/editProfile",{ errorMessage: "You must provide your vegetarian status" });
        return;
    }
    if (!xss(userInfo.dietoption)) {
        res.render("websiteLayout/editProfile",{ errorMessage: "You must provide a diet option" });
        return;
    }
        return userData.getUserById(req.user._id).then((getUser) => {
        return userData.updateUserProfile(req.user._id, getUser, userInfo)
            .then((updatedUser) => {
                res.redirect('/meal_collection/generateMeals');
            }, () => {
                res.sendStatus(500);
            });
    }).catch((error) => {
        res.render("websiteLayout/editProfile",{ errorMessage: error });
    });
});




router.get("/breakfast/:name", (req, res) => {
    let selectedMeal;
   breakfastList.forEach(function(meal) {
       if(meal.meal_name== xss(req.params.name)){
            selectedMeal= meal;
       }
   });
   res.render("websiteLayout/displayMeals",{meal:selectedMeal});
});
router.get("/lunch/:name", (req, res) => {
    let selectedMeal;
   lunchList.forEach(function(meal) {
       if(meal.meal_name==xss(req.params.name)){
            selectedMeal= meal;
       }
   });
   res.render("websiteLayout/displayMeals",{meal:selectedMeal});
});
router.get("/dinner/:name", (req, res) => {
    let selectedMeal;
   dinnerList.forEach(function(meal) {
       if(meal.meal_name==xss(req.params.name)){
            selectedMeal= meal;
       }
   });
   res.render("websiteLayout/displayMeals",{meal:selectedMeal});
});
router.get("/snack/:name", (req, res) => {
    let selectedMeal;
   snackList.forEach(function(meal) {
       if(meal.meal_name==xss(req.params.name)){
            selectedMeal= meal;
       }
   });
   res.render("websiteLayout/displayMeals",{meal:selectedMeal});
});


//generate meals
router.get("/generateMeals", (req, res) => {
        var userInfo = req.user;
     breakfastList=[];
     lunchList= [];
     dinnerList = [];
     snackList = [];
     userData.getUserByusername(xss(userInfo.profile.user_name)).then((user) => {
         commentData.getRecentUserComments(xss(userInfo.profile.user_name)).then((allComments) => {
         if(user.profile.vegetarian==="true"){
             //veg
             switch(user.profile.dietOption){
                 case "high protein":  mealData.getAllmeals().then((mealList) => {
                                            mealList.forEach(function(meal) {
                                                meal.breakfast.forEach(function(bf) {
                                                    if(bf.type== "vegetarian" && parseInt(bf.Protein)>15){
                                                         breakfastList.push(bf);
                                                    }
                                                });
                                                    meal.lunch.forEach(function(lunch) {
                                                    if(lunch.type== "vegetarian" && parseInt(lunch.Protein)>15){
                                                         lunchList.push(lunch);
                                                    }
                                                });
                                                meal.dinner.forEach(function(dinner) {
                                                    if(dinner.type== "vegetarian" && parseInt(dinner.Protein)>15){
                                                         dinnerList.push(dinner);
                                                    }
                                                });
                                                meal.snack.forEach(function(snack) {
                                                    if(snack.type== "vegetarian" && parseInt(snack.Protein)>15){
                                                         snackList.push(snack);
                                                    }
                                                });                                                
                                            });
                                            
                                    res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});
                                    }).catch((e) => {
                                        res.status(404).json({ error: "meals not found" });
                                    });
                                    break;

                case "low protein":  mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "vegetarian" && parseInt(bf.Protein)<15){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.Protein)<15){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.Protein)<15){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.Protein)<15){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                               
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});


                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;

                    case "high calorie": //>500
                                         mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "vegetarian" && parseInt(bf.Calories)>500){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.Calories)>500){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.Calories)>500){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.Calories)>500){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                                
                                                res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;

                    case "low calorie" ://<500
                                        mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "vegetarian" && parseInt(bf.Calories)<500){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.Calories)<500){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.Calories)<500){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.Calories)<500){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                               
                                                res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "high fiber" : //>5
                                        mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "vegetarian" && parseInt(bf.fibre)>5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.Fiber)>5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.Fiber)>5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.Fiber)>5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                               
                                                res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "low fiber" : //<5
                                         mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "vegetarian" && parseInt(bf.Fiber)<5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.Fiber)<5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.Fiber)<5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.Fiber)<5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                             
                                              res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "low fat": //<5
                                    mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "vegetarian" && parseInt(bf.Fat)<5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.Fat)<5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.Fat)<5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.Fat)<5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                              
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "high fat"://>5
                                    mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "vegetarian" && parseInt(bf.Fat)>5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.Fat)>5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.Fat)>5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.Fat)>5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                              
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });

             }
         }else{
             //non-vegetarian
             switch(user.profile.dietOption){
                 case "high protein":   //<15
                                            mealData.getAllmeals().then((mealList) => {
                                            mealList.forEach(function(meal) {
                                                meal.breakfast.forEach(function(bf) {
                                                    if(bf.type== "non-vegetarian" && parseInt(bf.Protein)>15){
                                                         breakfastList.push(bf);
                                                    }
                                                });
                                                    meal.lunch.forEach(function(lunch) {
                                                    if(lunch.type== "non-vegetarian" && parseInt(lunch.Protein)>15){
                                                         lunchList.push(lunch);
                                                    }
                                                });
                                                meal.dinner.forEach(function(dinner) {
                                                    if(dinner.type== "non-vegetarian" && parseInt(dinner.Protein)>15){
                                                         dinnerList.push(dinner);
                                                    }
                                                });
                                                meal.snack.forEach(function(snack) {
                                                    if(snack.type== "non-vegetarian" && parseInt(snack.Protein)>15){
                                                         snackList.push(snack);
                                                    }
                                                });                                                
                                            });
                                            
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                    }).catch((e) => {
                                        res.status(404).json({ error: "meals not found" });
                                    });
                                     break;

                case "low protein":  //<15
                                            mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.Protein)<15){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.Protein)<15){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.Protein)<15){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.Protein)<15){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                                
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;

                    case "high calorie": //>500
                                         mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.Calories)>500){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.Calories)>500){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.Calories)>500){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.Calories)>500){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                              
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;

                    case "low calorie" ://<500
                                        mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.Calories)<500){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.Calories)<500){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.Calories)<500){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.Calories)<500){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                              
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "high fiber" : //>5
                                        mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.Fiber)>5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.Fiber)>5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.Fiber)>5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.Fiber)>5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                               
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "low fiber" : //<5
                                         mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.Fiber)<5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.Fiber)<5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.Fiber)<5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.Fiber)<5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                               
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "low fat": //<5
                                    mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.Fat)<5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.Fat)<5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.Fat)<5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.Fat)<5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                              
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "high fat"://>5
                                    mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.Fat)>5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.Fat)>5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.Fat)>5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.Fat)>5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                                
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user, comment: allComments});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });

             }

         }
        }).catch(() => {
        response.render("websiteLayout/userProfile",{ user: user, error: "Comments Not Found"});
    });
    }).catch(() => {
        response.render("websiteLayout/userProfile",{ error: "User Not Found"});
    });
       
   
});


router.get("/meals", (req, res) => {
    mealData.getAllmeals().then((postList) => {
        res.json(postList);
    }).catch((e) => {
       // res.status(500).json({ error: e });
        res.status(404).json({ error: "meals not found" });

    });
});


router.post("/addMeals", (req, res) => {
    let inputData = req.body;
    inputData._id= uuid.v4();
   mealData.addMeals(inputData)
        .then((status) => {
            res.json(status);
        }).catch((e) => {
            console.log("---------error"+e);
            res.status(500).json({ error: e });
        });
});

router.put("/:id", (req, res) => {
    let updatedData = req.body;

    let getPost = mealData.getRecipieById(xss(req.params.id));

    getPost.then(() => {
        return mealData.updateRecipe(xss(req.params.id), updatedData)
            .then((updatedrecipie) => {
                res.json(updatedrecipie);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Post not found" });
    });

});
router.delete("/meals/:id", (req, res) => {
    let getPost = mealData.getMealById(xss(req.params.id));

    getPost.then(() => {
        return mealData.removerecipie(xss(req.params.id))
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "meal not found here" });
    });
});



module.exports = router;