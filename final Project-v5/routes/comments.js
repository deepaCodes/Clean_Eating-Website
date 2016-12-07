const express = require('express');
const router = express.Router();
const data = require("../data");
const commentData = data.comments;
const xss = require('xss');



router.get("/seeComments", (req, res) => {//keep this
    commentData.getAllComments().then((allComments) => {
        res.render('websiteLayout/comments',{ comment: allComments , username: req.user.profile.user_name });
    }).catch(() => {
        res.render('websiteLayout/comments',{ error: "Error retreiving comments"  });
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
            res.render('websiteLayout/comments',{ comment: allComments , username: req.user.profile.user_name, error: e });
        });
});

router.get("/getUserComments", (req, res) => {//keep this
    let username = xss(req.user.profile.user_name);
    let error = null;
    if (req.query.error === '1') { 
        error = 'No comment was deleted because you didn\'t select a comment. You must select a comment to delete if you want to perform a deletion';
    };
    commentData.getUserComments(username).then((allComments) => {
       //delete res.session.error; // remove from further requests
        res.render('websiteLayout/userComments',{ comment: allComments, error: error  });
        
    }).catch(() => {
        res.render('websiteLayout/userComments',{ error: "No comments found"  });
    });
});

router.post("/deleteComment", (req, res) => {
    let commentId = xss(req.body.deleteRadio);
    if (!commentId) {
        //req.flash('noCommentSelected', 'No comment was deleted because you didn\'t select a comment. You must select a comment to delete if you want to perform a deletion');
        res.redirect('/comments/getUserComments?error=1');
        return;
    }

        return commentData.deleteComment(commentId) 
        .then(()=>{
            res.redirect('/comments/seeComments');
        }).catch((error) => {
        res.render("websiteLayout/userComments",{ comment: req.body.comment, error: error });
    });
    
});


module.exports = router;