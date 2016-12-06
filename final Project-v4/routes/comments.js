const express = require('express');
const router = express.Router();
const data = require("../data");
const commentData = data.comments;
const xss = require('xss');



router.get("/seeComments", (req, res) => {//keep this
    commentData.getAllComments().then((allComments) => {
        res.render('websiteLayout/comments',{ comment: allComments  });
    }).catch(() => {
        res.render('websiteLayout/comments',{ error: "No comments found"  });
    });
});



router.post("/addComment", (req, res) => {//keep this
    let commentInfo = req.body;
//let username = req.user.profile.user_name;
    let username = xss(commentInfo.username);
    let comment = xss(commentInfo.comment);

    return commentData.addComment(username, comment)
        .then((newPost) => {
            res.json(newPost);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

router.get("/getUserComments", (req, res) => {//keep this
    let username = xss(req.user.profile.user_name);
    commentData.getUserComments(username).then((allComments) => {
        //res.json(allComments);
        res.render('websiteLayout/userComments',{ comment: allComments  });
    }).catch(() => {
        res.render('websiteLayout/userComments',{ error: "No comments found"  });
    });
});

router.post("/deleteComment", (req, res) => {
    let commentId = xss(req.body.deleteRadio);
        return commentData.deleteComment(commentId) 
        .then(()=>{
            res.redirect('/comments/seeComments');
        }).catch(() => {
        res.status(404).json({ error: "comment not found" });
    });
    
});


module.exports = router;