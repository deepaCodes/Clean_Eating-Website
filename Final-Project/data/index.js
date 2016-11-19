const mealCollectionRoutes = require("./meal_collection");
//const commentsRoutes = require("./comments");


let constructorMethod = (app) => {
    app.use("/meal_collection", mealCollectionRoutes);
};

module.exports = {
    meal_collection: require("./meal_collection"),
   // comments: require("./comments")
};