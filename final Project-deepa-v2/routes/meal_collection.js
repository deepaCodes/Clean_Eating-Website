const express = require('express');
const router = express.Router();
const data = require("../data");
const mealData = data.meal_collection;
const userData = data.user_collection;
var passport = require('passport');


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


router.post('/login',
  passport.authenticate('local', { successRedirect: '/meal_collection/generateMeals',
                                   failureRedirect: '/meal_collection/',
                                   failureFlash: true
                                   })
);

//signup post
router.post("/signup", (req, res) => {
    userData.addUserProfile(req.body.name,req.body.username, req.body.password, req.body.weight, req.body.height, req.body.age,req.body.vegetarian,req.body.dietoption)
        .then((newUser) => {
                res.redirect('/meal_collection/login');
        }, () => {
            res.sendStatus(500);
         });
});



router.get("/breakfast/:name", (req, res) => {
    let selectedMeal;
   breakfastList.forEach(function(meal) {
       if(meal.meal_name==req.params.name){
            selectedMeal= meal;
       }
   });
   console.log(selectedMeal);
   res.render("websiteLayout/displayMeals",{meal:selectedMeal});
});
router.get("/lunch/:name", (req, res) => {
    let selectedMeal;
   lunchList.forEach(function(meal) {
       if(meal.meal_name==req.params.name){
            selectedMeal= meal;
       }
   });
   console.log(selectedMeal);
   res.render("websiteLayout/displayMeals",{meal:selectedMeal});
});
router.get("/dinner/:name", (req, res) => {
    let selectedMeal;
   dinnerList.forEach(function(meal) {
       if(meal.meal_name==req.params.name){
            selectedMeal= meal;
       }
   });
   console.log(selectedMeal);
   res.render("websiteLayout/displayMeals",{meal:selectedMeal});
});
router.get("/snack/:name", (req, res) => {
    let selectedMeal;
   snackList.forEach(function(meal) {
       if(meal.meal_name==req.params.name){
            selectedMeal= meal;
       }
   });
   console.log(selectedMeal);
   res.render("websiteLayout/displayMeals",{meal:selectedMeal});
});


//generate meals
router.get("/generateMeals", (req, res) => {
        var userInfo = req.user;
console.log("---username "+JSON.stringify(userInfo));
     breakfastList=[];
     lunchList= [];
     dinnerList = [];
     snackList = [];
     console.log("username "+userInfo.profile.user_name);
     userData.getUserByusername(userInfo.profile.user_name).then((user) => {
         if(user.profile.vegetarian==true){
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
                                            console.log("Breakfast : "+JSON.stringify(breakfastList));
                                            console.log("lunch : "+JSON.stringify(lunchList));
                                            console.log("dinner : "+JSON.stringify(dinnerList));
                                            console.log("snack : "+JSON.stringify(snackList));
                                    res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});
                                    }).catch((e) => {
                                        res.status(404).json({ error: "meals not found" });
                                    });
                                    break;

                case "low protien":  mealData.getAllmeals().then((mealList) => {
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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});


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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                                res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                                res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

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
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.fibre)>5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.fibre)>5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.fibre)>5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                                res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "low fibre" : //<5
                                         mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "vegetarian" && parseInt(bf.fibre)<5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "vegetarian" && parseInt(lunch.fibre)<5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "vegetarian" && parseInt(dinner.fibre)<5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "vegetarian" && parseInt(snack.fibre)<5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                              res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });

             }
         }else{
             //non-vegetarian
             switch(user.profile.dietOption){
                 case "high protein":  mealData.getAllmeals().then((mealList) => {
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
                                            console.log("Breakfast : "+JSON.stringify(breakfastList));
                                            console.log("lunch : "+JSON.stringify(lunchList));
                                            console.log("dinner : "+JSON.stringify(dinnerList));
                                            console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

                                    }).catch((e) => {
                                        res.status(404).json({ error: "meals not found" });
                                    });
                                     break;

                case "low protien":  mealData.getAllmeals().then((mealList) => {
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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "high fiber" : //>5
                                        mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.fibre)>5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.fibre)>5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.fibre)>5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.fibre)>5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });
                                         break;
                    case "low fibre" : //<5
                                         mealData.getAllmeals().then((mealList) => {
                                                mealList.forEach(function(meal) {
                                                    meal.breakfast.forEach(function(bf) {
                                                        if(bf.type== "non-vegetarian" && parseInt(bf.fibre)<5){
                                                              breakfastList.push(bf);
                                                    }
                                                    });
                                                        meal.lunch.forEach(function(lunch) {
                                                            if(lunch.type== "non-vegetarian" && parseInt(lunch.fibre)<5){
                                                                  lunchList.push(lunch);
                                                            }
                                                    });
                                                    meal.dinner.forEach(function(dinner) {
                                                        if(dinner.type== "non-vegetarian" && parseInt(dinner.fibre)<5){
                                                             dinnerList.push(dinner);
                                                        }
                                                    });
                                                    meal.snack.forEach(function(snack) {
                                                        if(snack.type== "non-vegetarian" && parseInt(snack.fibre)<5){
                                                            snackList.push(snack);
                                                        }
                                                    });                                                   
                                                });
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

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
                                                console.log("Breakfast : "+JSON.stringify(breakfastList));
                                                console.log("lunch : "+JSON.stringify(lunchList));
                                                console.log("dinner : "+JSON.stringify(dinnerList));
                                                console.log("snack : "+JSON.stringify(snackList));
                                             res.render("websiteLayout/meal-user",{breakfast:breakfastList, lunch:lunchList,dinner:dinnerList,snack:snackList,user:user});

                                        }).catch((e) => {
                                            res.status(404).json({ error: "meals not found" });
                                        });

             }

         }
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
    console.log(inputData);
    inputData._id= uuid.v4();
    console.log(JSON.stringify(inputData));
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

    let getPost = mealData.getRecipieById(req.params.id);

    getPost.then(() => {
        return mealData.updateRecipe(req.params.id, updatedData)
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
    let getPost = mealData.getMealById(req.params.id);

    getPost.then(() => {
        return mealData.removerecipie(req.params.id)
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