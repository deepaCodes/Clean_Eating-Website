const mealCollectionRoutes = require("./meal_collection");
const userCollectionRoutes = require("./user_collection");


const constructorMethod = (app) => {
    app.use("/meal_collection", mealCollectionRoutes);
    app.use("/user", userCollectionRoutes);
    //app.use("/comments", commentsRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};

module.exports = constructorMethod;