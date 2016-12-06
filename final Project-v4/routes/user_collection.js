const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.user_collection;



router.get("/:id", (req, response) => {//works
    userData.getUserById(xss(req.params.id)).then((user) => {
        response.render("websiteLayout/userProfile",{ user: user });
    }).catch(() => {
        response.render("websiteLayout/userProfile",{ error: "User Not Found"});
    });
});

router.get("/", (req, res) => {//works
    userData.getAllUsers().then((userList) => {
        res.json(userList);
    }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
    });
});

router.post("/addUser", (req, res) => {//create a user, works
    let userInfo = req.body;

    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to create a user" });
        return;
    }

    if (!xss(userInfo.profile.name)) {
        res.status(400).json({ error: "You must provide a name" });
        return;
    }

    if (!xss(userInfo.profile.userName)) {
        res.status(400).json({ error: "You must provide a user name" });
        return;
    }

    if (!xss(userInfo.profile.weight)) {
        res.status(400).json({ error: "You must provide a weight" });
        return;
    }

    if (!xss(userInfo.profile.height)) {
        res.status(400).json({ error: "You must provide a height" });
        return;
    }

    if (!xss(userInfo.profile.age)) {
        res.status(400).json({ error: "You must provide an age" });
        return;
    }

    userData.addUserProfile(xss(userInfo.profile.name), xss(userInfo.profile.userName),xss(userInfo.profile.password), xss(userInfo.profile.weight), xss(userInfo.profile.height), xss(userInfo.profile.age))
        .then((newUser) => {
            res.json(newUser);
        }, () => {
            res.sendStatus(500);
        });
});

router.put("/:id", (req, res) => {//update a user, works
    let userInfo = req.body;

    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to update a user" });
        return;
    }

    if (!xss(userInfo.cholesterol)) {
        res.status(400).json({ error: "You must provide a cholesterol level" });
        return;
    }

    if (!xss(userInfo.weight)) {
        res.status(400).json({ error: "You must provide a weight" });
        return;
    }

    if (!xss(userInfo.weightGoal)) {
        res.status(400).json({ error: "You must provide a weight goal" });
        return;
    }

    if (typeof userInfo.vegetarian !== "boolean") {
        res.status(400).json({ error: "You must provide a vegetarian option" });
        return;
    }

    if (!xss(userInfo.dietOption)) {
        res.status(400).json({ error: "You must provide a diet option" });
        return;
    }

    return userData.getUserById(req.params.id).then((getUser) => {
        return userData.updateUserProfile(req.params.id, getUser, userInfo)
            .then((updatedUser) => {
                res.json(updatedUser);
            }, () => {
                res.sendStatus(500);
            });
    }).catch(() => {
        res.status(404).json({ error: "User not found" });
    });

});

router.delete("/:id", (req, res) => {//delete user, works
    let user = userData.getUserById(xss(req.params.id)).then(() => {
        return userData.removeUserProfile(xss(req.params.id))
            .then(() => {
                res.sendStatus(200);
            }).catch(() => {
                res.sendStatus(500);
            });

    }).catch(() => {
        res.status(404).json({ error: "User not found" });
    });
});

module.exports = router;