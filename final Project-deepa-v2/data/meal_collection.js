const mongoCollections = require("../config/mongoCollections");
const meals = mongoCollections.meal_collection;
const uuid = require('node-uuid');

let exportedMethods = {
    getAllmeals() {
        return meals().then((mealCollection) => {
            return mealCollection.find({}).toArray();
        });
    },
    
       getMealById(id) {
        return meals().then((mealCollection) => {
            return mealCollection.findOne({ _id: id }).then((post) => {
                if (!post) throw "meal not found";
                return post;
            });
        });
    },
    

    addMeals(inputData) {
        return meals().then((mealCollection) => {
                       return mealCollection.insertOne(inputData).then((newInsertInformation) => {
                        return newInsertInformation.insertedId;
                    }).then((newId) => {
                        return "Data inserted with id "+newId;
                    });
                });
        
    },
    
    updateRecipe(id, updatedRecipe) {
        return meals().then((mealCollection) => {
            let updatedRecipeData = {};

            if (updatedRecipe.title) {
                updatedRecipeData.title = updatedRecipe.title;
            }

            if (updatedRecipe.ingredients) {
                updatedRecipeData.ingredients = updatedRecipe.ingredients;
            }

            if (updatedRecipe.steps) {
                updatedRecipeData.steps = updatedRecipe.steps;
            }

            let updateCommand = {
                $set: updatedRecipeData
            };

            return mealCollection.updateOne({ _id: id }, updateCommand).then((result) => {
                return this.getRecipieById(id);
            });
        });
    },

    removerecipie(id) {
        return meals().then((mealCollection) => {
            return mealCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete post with id of ${id}`)
                } else { }
            });
        });
    },

    

}




module.exports = exportedMethods;