(function ($) {

    var commentsTable = $("#recent-comments-table tbody");

    function resetTable(response) {

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
        
        
            var requestConfig = {
                method: "GET",
                url: "/comments/getUserRecentComments",
                contentType: 'application/json'

            };
            //AJAX requests are async so returns a promise
            $.ajax(requestConfig).done(function (responseMessage) {
                resetTable(responseMessage);

            }).fail(function(jqXHR,textStatus){
                alert("Request failed: " + jqXHR.error);
                errorMessageArea.html("<p>Error: " + jqXHR.error+"</p>");
            });
            //.catch((e) => {
               // console.log("Error submitting request:" + e);
              //  errorMessageArea.html("Error submitting request:" + e);
            //});
        
       
    });
})(window.jQuery);