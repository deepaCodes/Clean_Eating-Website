const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.user_collection;
const uuid = require('node-uuid');

let exportedMethods = {
    getAllUsers() {//works
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },
     getUserByusername(uname) {//works
        return users().then((userCollection) => {
            return userCollection.findOne({ "profile.user_name":uname}).then((user) => {
                if (!user) throw "User not found";
                return user;
            });
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
    addUserProfile(name, userName,password, weight, height, age,vegetarian,mealoption) {//works
        console.log("veg and diet option "+vegetarian +" "+mealoption);
        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(),  
                hashedPassword: uuid.v4(),
                profile: {
                    name: name,
                    user_name: userName, 
                    password:password,
                    weight: weight,
                    height: height,
                    age: age,
                    cholesterol: null,
                    weightGoal: null,
                    vegetarian: vegetarian,
                    dietOption: mealoption

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
                    password: currentUserInfo.profile.password,
                    weight: currentUserInfo.profile.weight,
                    height: currentUserInfo.profile.height,
                    age: currentUserInfo.profile.age,
                    cholesterol: null,
                    weightGoal: null,
                    vegetarian: currentUserInfo.profile.vegetarian,
                    dietOption: currentUserInfo.profile.dietOption
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

            if (updatedProfile.vegetarian) {
                updatedUserData.profile.vegetarian = updatedProfile.vegetarian;
            }

            if (updatedProfile.dietoption) {
                updatedUserData.profile.dietOption = updatedProfile.dietoption;
            }

            let updateCommand = {
                $set: updatedUserData
            };

            return userCollection.updateOne({_id: id }, updateCommand).then((result) => {
                return this.getUserById(id);
            });
        });

    }

}

module.exports = exportedMethods;