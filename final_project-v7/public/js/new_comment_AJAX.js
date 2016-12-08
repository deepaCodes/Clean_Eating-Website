(function ($) {

    var myNewCommentForm = $("#new-comment-form"),
        userNameInput = $("#new-comment-username"),
        newCommentTextArea = $("#new-comment-body"),
        commentsTable = $("#comments-table tbody");

    function resetTable(username,newComment) {

            var newHtmlString = "<tr><td>" + username + "</td><td>" + newComment + "</td></tr>"
            commentsTable.prepend(newHtmlString);
            myNewCommentForm[0].reset();
    }
    

    
    //capturing event
    myNewCommentForm.submit(function (event) {
        event.preventDefault();

        var username = userNameInput.val();
        var newComment = newCommentTextArea.val();
        var errorMessageArea = $("#error-message-area");
        
    
        //error checking for value existence, type, and bounds
        if (username === undefined || username === "") errorMessageArea.html("<p>Error: No username is provided.</p>");
        if(typeof username !== "string") errorMessageArea.html("<p>Error: Must provide the username as a string</p>");


        if (newComment === undefined || newComment === "") errorMessageArea.html("<p>Error: No comment is provided</p>");
        if(typeof newComment !== "string") errorMessageArea.html("<p>Error: Must provide the comment as a string</p>");


        if (username && newComment) {
            var requestConfig = {
                method: "POST",
                url: "/comments/addComment",
                contentType: 'application/json',
                data: JSON.stringify({
                    username: username,
                    comment: newComment
                })
            };
            //AJAX requests are async so returns a promise
            $.ajax(requestConfig).done(function (responseMessage) {
                resetTable(username,newComment);

            }).fail(function(jqXHR,textStatus){
                alert("Request failed: " + jqXHR.error);
                errorMessageArea.html("<p>Error: " + jqXHR.error+"</p>");
            });
            //.catch((e) => {
               // console.log("Error submitting request:" + e);
              //  errorMessageArea.html("Error submitting request:" + e);
            //});
        }
        else{
            errorMessageArea.html("<p>Error: Please enter a comment.</p>");
        }
    });
})(window.jQuery);