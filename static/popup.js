// When the user clicks the button, open the modal
$("#progress-bar").click(function() {
    $("#score-modal").css("display", "block");
});

// When the user clicks on <span> (x), close the modal
$(".close").click(function() {
    $("#score-modal").css("display", "none");
});

// When the user clicks anywhere outside of the modal, close it
$(document).click(function(event) {
    if (event.target == $("#score-modal")[0]) {
        $("#score-modal").css("display", "none");
        $("#guess-input").focus();
    }
});
