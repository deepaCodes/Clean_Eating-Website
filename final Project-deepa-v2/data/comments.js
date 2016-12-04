const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.recipie;
const recipie = require("./recipie");
const uuid = require('node-uuid');

let exportedMethods = {

    getAllComments(recipieId) {
        return comments().then((recipieCollection) => {
            return recipieCollection.findOne({ _id: recipieId }).then((recipie) => {
                console.log(recipie);
            return recipie.comments;
        });
        });

    },
    
getCommentInfo(commentId){
    console.log(commentId);
    return comments().then((recipieCollection) => {
                            console.log("inside comment info");

            return recipieCollection.findOne({"comments":{"$elemMatch":{"_id":commentId}}},{"title":1, "comments.$._id": 1 }).then((commentInfo)=>{
                    console.log(commentInfo);
                    return commentInfo;
            });

});
},

    getCommentById(recipieId,commentId) {


        return comments().then((postCollection) => {
            return postCollection.findOne({ _id: recipieId }).then((post) => {
                if (!post) throw "Post not found";
             let foundobj;
                post.comments.forEach(function(comment) {
                    if(comment._id===commentId){
                        foundobj=comment;
                       

                    }
                });
            if(foundobj){
                return foundobj;
            }else{ throw "comment not found";
            }       


        });
        });
    },

    updateComment(recipieID,commentId,updatedData){
          console.log("update comment1");
         // iF(!updatedData) return Promise.reject("");
          //if(!updatedData.title) return P
            return comments().then((recipieCollection) => {


            return recipieCollection.updateOne({_id:recipieID,"comments._id":commentId},
                {$set:{"comments.$.poster":updatedData.poster, "comments.$.comment":updatedData.comment}})
            .then((commentInfo)=>{
                  
                    return commentInfo;
            });
            });
    },


    addComment(poster,comment,recipieId) {
        return comments().then((recipieCollection) => {
            return recipie.getRecipieById(recipieId)
                .then((recipieObject) => {
                      let updatedRecipeData = {};
                    let newPost = {
                        poster: poster,
                        comment: comment,
                        _id: uuid.v4()
                    };
                    
                    if(!recipieObject.comments){
                        recipieObject.comments = [newPost];
                    } else {
                        recipieObject.comments.push(newPost);
                    }

                    updatedRecipeData.comments = recipieObject.comments;


                      console.log(updatedRecipeData.comments);
                      console.log(updatedRecipeData.comments.length);

                       let updateCommand = {
                             $set: updatedRecipeData
                     };

                       return recipieCollection.updateOne({ _id: recipieId }, updateCommand).then((result) => {
                           console.log("updated data");
                            return this.getCommentById(recipieId,newPost._id);
                  });

                  
                });
        });
    },
    
    deleteComment(commentID){
        console.log("indide function"+commentID);
        return comments().then((recipieCollection) => {
                
            return recipieCollection.update({"comments._id":commentID},
                                { $pull: {"comments":{"_id": commentID}}})
            .then((commentInfo)=>{
                    
                    return commentInfo;
            });
            });

    }
   
    
}

module.exports = exportedMethods;