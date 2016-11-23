const express = require('express');
const router = express.Router();
const data = require("../data");
const commentData = data.comments;
const recipieData = data.recipie;


router.get("/comments/:commentId", (req, res) => {
    commentData.getCommentInfo(req.params.commentId).then((post) => {
        res.json(post);
    }).catch(() => {
        res.status(404).json({ error: "Post not found" });
    });
});



router.get("/comments/recipe/:recipeId", (req, res) => {
    commentData.getAllComments(req.params.recipeId).then((postList) => {
         res.json(postList);
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});

router.post("/comments/:recipeId/", (req, res) => {
    let commentInfo = req.body;

    commentData.addComment(commentInfo.poster, commentInfo.comment,req.params.recipeId)
        .then((newPost) => {
            res.json(newPost);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

router.put("/comments/:recipeId/:commentId", (req, res) => {
    let updatedData = req.body;
    let getRecipie = recipieData.getRecipieById(req.params.recipeId);
    let getPost = commentData.getCommentById(req.params.recipeId,req.params.commentId);

getRecipie.then(()=>{
    getPost.then(() => {
        console.log("inside upate comment");
        return commentData.updateComment(req.params.recipeId,req.params.commentId, updatedData)
            .then((updatedComment) => {
                res.json(updatedComment);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "comment not found" });
    });
}).catch(()=>{
            res.status(404).json({ error: "Recipie not found" });

})

});

router.delete("/comments/:id", (req, res) => {
   console.log("inside delete");


   
          let deleteResult= commentData.deleteComment(req.params.id); 
        deleteResult.then(()=>{
            res.json(deleteResult);
        }).catch(() => {
        res.status(404).json({ error: "comment not found" });
    });
    
});


module.exports = router;