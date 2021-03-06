const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.user_collection;
const uuid = require('node-uuid');

let exportedMethods = {
    getAllUsers() {//works
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },

    getUserById(id) {//works
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) throw "User not found";
                return user;
            });
        });
    },
    addUserProfile(name, userName, weight, height, age) {//works
        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(), 
                sessionId: uuid.v4(), 
                hashedPassword: uuid.v4(),
                profile: {
                    name: name,
                    user_name: userName, 
                    weight: weight,
                    height: height,
                    age: age,
                    cholesterol: null,
                    weightGoal: null,
                    vegetarian: null,
                    dietOption: null

                }
            };

            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        });
    },
    removeUserProfile(id) {//works
        if(!id) 
            return Promise.reject("You must provide an id for your user");
        if(typeof id !== "string") 
            return Promise.reject("The id must be a string value");
        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        });
    },
    updateUserProfile(id, currentUserInfo,updatedProfile) {//works
        if(!id) 
            return Promise.reject("You must provide an id for your user");
        if(typeof id !== "string") 
            return Promise.reject("The id must be a string value");
        if(!updatedProfile) 
            return Promise.reject("You must provide an update for the user");

        return users().then((userCollection) => {
            let updatedUserData = {
                profile:{
                    name: currentUserInfo.profile.name,
                    user_name: currentUserInfo.profile.user_name, 
                    weight: currentUserInfo.profile.weight,
                    height: currentUserInfo.profile.height,
                    age: currentUserInfo.profile.weight,
                    cholesterol: null,
                    weightGoal: null,
                    vegetarian: null,
                    dietOption: null
                }
            };

            if (updatedProfile.cholesterol) {
                updatedUserData.profile.cholesterol = updatedProfile.cholesterol;
            }

            if (updatedProfile.weight) {
                updatedUserData.profile.weight = updatedProfile.weight;
            }

            if (updatedProfile.weightGoal) {
                updatedUserData.profile.weightGoal = updatedProfile.weightGoal;
            }

            if (typeof updatedProfile.vegetarian == "boolean") {
                updatedUserData.profile.vegetarian = updatedProfile.vegetarian;
            }

            if (updatedProfile.dietOption) {
                updatedUserData.profile.dietOption = updatedProfile.dietOption;
            }

            let updateCommand = {
                $set: updatedUserData
            };

            return userCollection.updateOne({ _id: id }, updateCommand).then((result) => {
                return this.getUserById(id);
            });
        });

    }

}

module.exports = exportedMethods;