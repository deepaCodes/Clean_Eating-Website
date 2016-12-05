(function ($) {

    var myNewNoteForm = $("#new-note-form"),
        newTitleInput = $("#new-note-title"),
        newDateInput = $("#new-note-dueDate"),
        newSummaryInput = $("#new-note-summary"),
        newNoteBodyTextArea = $("#new-note-body");

    
    //capturing event
    myNewNoteForm.submit(function (event) {
        event.preventDefault();

        var newTitle = newTitleInput.val();
        var newDate = newDateInput.val();
        var newSummary = newSummaryInput.val();
        var newNoteBody = newNoteBodyTextArea.val();
        var errorMessageArea = $("#error-message-area");
        console.log("new title: " + newTitle);
    
        //error checking for value existence, type, and bounds
        if (newTitle === undefined || newTitle === "") errorMessageArea.html("<p>Error: No title is provided.</p>");
        if(typeof newTitle !== "string") errorMessageArea.html("<p>Error: Must provide the title as a string</p>");


        if (newDate === undefined || newDate === "") errorMessageArea.html("<p>Error: No due date is provided</p>");
        //if(!(newDate instanceof Date)) errorMessageArea.html("<p>Error: Must provide the due date as a date</p>");

        if (newSummary === undefined || newSummary === "") errorMessageArea.html("<p>Error: No summary is provided</p>");
        if(typeof newSummary !== "string") errorMessageArea.html("<p>Error: Must provide the summary as a string</p>");


        if (newNoteBody === undefined || newNoteBody === "") errorMessageArea.html("<p>Error: No body is provided</p>");
        if(typeof newNoteBody !== "string") errorMessageArea.html("<p>Error: Must provide the body as a string</p>");


        if (newTitle && newDate && newSummary && newNoteBody) {
            var requestConfig = {
                method: "POST",
                url: "/notes/new",
                contentType: 'application/json',
                data: JSON.stringify({
                    title: newTitle,
                    dueDate: newDate,
                    summary: newSummary,
                    noteBody: newNoteBody
                })
            };
            //AJAX requests are async so returns a promise
            $.ajax(requestConfig).done(function (responseMessage) {
                console.log(responseMessage);
                //newContent.html(responseMessage.message);
                //                alert("Data Saved: " + msg);
                if(responseMessage.redirectUrl){
                    console.log(responseMessage.redirectUrl);
                    window.location = responseMessage.redirectUrl;
                }
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
            errorMessageArea.html("<p>Error: Please enter all fields and the Due Date must be a date value.</p>");
        }
    });
})(window.jQuery);