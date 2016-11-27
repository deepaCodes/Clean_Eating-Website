const express = require('express');
const router = express.Router();
const data = require("../data");
const mealData = data.meal_collection;
const uuid = require('node-uuid');




router.get("/meals/:id", (req, res) => {
    mealData.getMealById(req.params.id).then((reqRecipie)=>{
        res.json(reqRecipie);
    }).catch((e)=>{
       // res.status(500).json({ error: e });
               res.status(404).json({ error: "recipie not found" });

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