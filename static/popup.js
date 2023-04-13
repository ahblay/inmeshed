$("#progress-bar").click(function() {
    $("#score-modal").css("display", "block");
});

$("#stats-icon").click(function() {
    $("#stats-modal").css("display", "block");
});

$("#info-icon").click(function() {
    $("#info-modal").css("display", "block");
});

$(".close").click(function() {
    $(".modal").css("display", "none");
});

// When the user clicks anywhere outside of the modal, close it
$(document).click(function(event) {
    if (event.target == $(".modal:visible")[0]) {
        $(".modal").css("display", "none");
        $("#guess-input").focus();
    }
});
