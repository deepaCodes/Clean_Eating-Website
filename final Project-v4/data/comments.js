const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comment_collection;
const uuid = require('node-uuid');

let exportedMethods = {

    getAllComments() {
        return comments().then((commentsCollection) => {
            return commentsCollection.find({}).toArray();
        });

    },

getUserComments(username) {
        return comments().then((commentsCollection) => {
            return commentsCollection.find({username:username}).toArray();
        });

    },

    addComment(username,comment) {//keep
        return comments().then((commentsCollection) => {
            let newComment = {
                _id: uuid.v4(), 
                username: username, 
                comment: comment
                }

            return commentsCollection.insertOne(newComment).then((newlyCreatedComment) => {
                return newlyCreatedComment;
            });
        });
    },
    
    deleteComment(commentID){
        if(!commentID) 
            return Promise.reject("You must provide an id for your comment");
        if(typeof commentID !== "string") 
            return Promise.reject("The id must be a string value");
        return comments().then((commentsCollection) => {
            return commentsCollection.removeOne({ _id: commentID }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        });

    }
   
    
}

module.exports = exportedMethods;