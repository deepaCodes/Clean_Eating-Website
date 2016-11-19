const mealCollectionRoutes = require("./meal_collection");
//const commentsRoutes = require("./comments");


const constructorMethod = (app) => {
    app.use("/meal_collection", mealCollectionRoutes);
    //app.use("/comments", commentsRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};

module.exports = constructorMethod;