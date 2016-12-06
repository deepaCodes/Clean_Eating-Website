const mealCollectionData = require("./meal_collection");
const userCollectionData = require("./user_collection");
const commentsCollectionData = require("./comments");
//const commentsRoutes = require("./comments");


//let constructorMethod = (app) => {
//    app.use("/meal_collection", mealCollectionRoutes);
//};

module.exports = {
    meal_collection: mealCollectionData,
    user_collection: userCollectionData,
    comments: commentsCollectionData
   // comments: require("./comments")
};