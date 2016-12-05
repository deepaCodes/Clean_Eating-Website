(function ($) {

    var getNextNoteLink = $("#get-next-note"),
        currentTitleInput = $("#note-title"),
        currentDateInput = $("#note-date"),
        currentSummaryInput = $("#note-summary"),
        currentBodyInput = $("#note-body"),
        nextIdInput = $("#next-id");
        

    
    //capturing event

getNextNoteLink.click(function(event){
        event.preventDefault();

        var currentTitle = currentTitleInput.text();
        var currentDate = currentDateInput.text();
        var currentSummary = currentSummaryInput.text();
        var currentBody = currentBodyInput.text();
        var nextId = nextIdInput.text();
        console.log("next id: " + nextId);
        console.log("title: " + currentTitle);
        console.log("date: " + currentDate);
        console.log("sumary: " + currentSummary);
        console.log("body: " + currentBody);
        
        var requestConfig = {
                method: "GET",
                url: "/notes/next/" + nextId,
                contentType: 'application/json',
                data: JSON.stringify({
                    id: nextId
                })
            };
        console.log(requestConfig);
        $.ajax(requestConfig).then(function (responseMessage) {
                //console.log(responseMessage);
                //newContent.html(responseMessage.message);
                //                alert("Data Saved: " + msg);
                

                 if(responseMessage.redirectUrl){
                     //console.log("in redirect")
                    //nextIdInput.text(responseMessage.nextId);
                    //currentTitleInput.text(responseMessage.nextId);
                    //currentDateInput.text(responseMessage.nextId);
                    //currentSummaryInput.text(responseMessage.nextId);
                    //currentBodyInput.text(responseMessage.nextId);
                 window.location = responseMessage.redirectUrl;
                }

            });

    });
})(window.jQuery);