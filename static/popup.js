function calculatePointWidth(wordScore, goalScore) {
     return (wordScore/goalScore) * 100
}

function getDayOfWeek(date) {
  const dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek) ? null :
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][dayOfWeek];
}

function getPreviousDay(currentDay) {
    // Calculate yesterday's date
    var yesterday = new Date(currentDay);
    yesterday.setDate(yesterday.getDate());

    // Extract the year, month, and day from yesterday's date
    var year = yesterday.getFullYear();
    var month = yesterday.getMonth() + 1; // Add 1 to the month, as it is zero-based
    var day = yesterday.getDate();

    // Format yesterday's date as a string in the format 'yyyy-mm-dd'
    var yesterdayFormatted = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

    return yesterdayFormatted
}

function getPriorDays(weekday) {
    if (weekday == null) {
        return
    }
    var dates = [];
    const dayOfWeek = new Date(weekday).getDay();
    for (i = 0; i <= dayOfWeek; i++) {
        dates.push(weekday);
        weekday = getPreviousDay(weekday);
    }
    //weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    //const weekdayIdx = weekdays.indexOf(weekday)
    return dates
}

function handleStatsBarLayout(id, todayDate) {
    const stats = getDailyStats();
    const todayDay = getDayOfWeek(todayDate);
    const todayStats = stats[id];
    const guessTypes = ["uncommon", "no-hint", "one-hint", "two-hint"];
    const categoryNames = ["Uncommon words", "No hints", "One hint", "Two hints"];
    var totalPercentage = 0;
    var counter = 0;
    guessTypes.forEach((type) => {
        var wordScoreTuples = todayStats[type];
        var totalScore = 0;
        wordScoreTuples.forEach((tuple) => {
            var score = tuple[1];
            totalScore += score;
        });
        var percentageFilled = calculatePointWidth(totalScore, todayStats['goalScore']);
        totalPercentage += percentageFilled;
        if (totalPercentage < 100) {
            $("#weekday-" + todayDay + " .stats-" + type).css("min-width", percentageFilled + "%");
        } else {
            var fillUp = percentageFilled - (totalPercentage - 100);
            totalPercentage = 100;
            $("#weekday-" + todayDay + " .stats-" + type).css("min-width", fillUp + "%");
        }
        if (wordScoreTuples.length == 1) {
            var tooltipText = categoryNames[counter] + ": " + totalScore + " points (" + wordScoreTuples.length + " word) found";
        } else {
            var tooltipText = categoryNames[counter] + ": " + totalScore + " points (" + wordScoreTuples.length + " words) found";
        }

        $("#weekday-" + todayDay + " .stats-" + type).attr("data-text", tooltipText);
        counter += 1;
    });

    $("#weekday-" + todayDay + " .stats-bar-label").html(todayStats['levelName']);
    $("#weekday-" + todayDay + " .stats-bar-score").html(todayStats['bestScore'] + " of " + todayStats['goalScore']);
    return
}

function updateStatsBar(todayDate) {
    const dateIdDict = getDateIdDict();
    if (dateIdDict.hasOwnProperty(todayDate)) {
        const id = dateIdDict[todayDate];
        handleStatsBarLayout(id, todayDate);

        /*
        const data = {"id": JSON.stringify(id)};
        if (todayDate == getTodayDate()) {
            const goalScore = getGoalScore();
            const level = $("#progress-bar > .active").attr("id");
            var levelName = $("#ranking-" + level + " .level").html();
            handleStatsBarLayout(id, todayDate, goalScore, levelName);
        } else {
            $.get("/get_game_info", data).done(function(data) {
                if (data["success"]) {
                    var solutions = data["result"]["solutions"];
                    var goalScore = 0;
                    solutions.forEach((word) => {
                        goalScore += calculateWordScore(word)[0];
                    });
                    const best = goalScore - 1;
                    const percentages = [0, 0.06, 0.14, 0.25, 0.38, 0.55, 0.78, 1];
                    var levelName = "";
                    $("#progress-bar li").each(function(idx, li) {
                        if (Math.round(best * percentages[idx]) < $(li).data("threshold")) {
                            const level = $(li).prev("li").attr("id");
                            levelName = $("#ranking-" + level + " .level").html();
                            return false
                        }
                    });
                    console.log("Check to confirm return false did not fully return")
                    handleStatsBarLayout(id, todayDate, goalScore, levelName);
                } else {
                    var message = data["results"];
                    $("#weekday-" + todayDay + " .stats-bar-label").html(message);
                    return
                }
            });
        }
        */

    } else {
        return
    }
}

function renderAnswer(word, found, uncommon) {
    const wordElement = $('<div />').attr('class', 'answer');
    word = word[0].toUpperCase() + word.substring(1);
    if (found) {
        // set color to yellow
        $(wordElement).addClass("yellow");
        if (uncommon) {
            // set to all caps
            word = word.toUpperCase();
        }
    } else {
        if (uncommon) {
            // set to all caps
            word = word.toUpperCase();
        }
    }
    $(wordElement).html(word);
    $("#yesterday-words").append(wordElement);
    return
}

function collapseWordsFromStats(stats) {
    var foundWords = [];
    const keys = ["uncommon", "no-hint", "one-hint", "two-hint"];
    keys.forEach((key) => {
        var wordScoreTuples = stats[key];
        wordScoreTuples.forEach((tuple) => {
            foundWords.push(tuple[0]);
        });
    })
    return foundWords
}

function buildYesterdayAnswers(data, foundWords) {
    console.log(data)
    var allSolutions = data["solutionsFrequencies"];
    var easySolutions = data["solutions"];
    for (const [word, frequency] of Object.entries(allSolutions)) {
        var uncommon = false;
        var found = false;
        if (frequency == 0) {
            uncommon = true;
        }
        if (foundWords.includes(word)) {
            found = true;
        }
        renderAnswer(word, found, uncommon);
    }
}

$("#progress-bar").click(function() {
    $("#score-modal").css("display", "block");
});

$("#stats-icon").click(function() {
    $("#stats-modal").css("display", "block");
    var todayDate = getTodayDate();
    const daysToFill = getPriorDays(todayDate);
    //const daysToFill = ['2023-04-25', '2023-04-24', '2023-04-23', '2023-04-22', '2023-04-21', '2023-04-20']
    daysToFill.forEach((day) => {
        updateStatsBar(day);
    });
});

$("#settings-icon").click(function() {
    $("#settings-modal").css("display", "block");
});

$("#share-button").click(function() {
    $("#share-modal").css("display", "block");
});

$("#yesterday-answers-button").click(function() {
    $("#yesterday-answers-modal").css("display", "block");
    $("#yesterday-words").empty();

    const stats = getDailyStats();
    const todayDate = getTodayDate();
    const yesterday = getPreviousDay(todayDate);
    const dateIdDict = getDateIdDict();
    if (dateIdDict.hasOwnProperty(yesterday)) {
        const id = dateIdDict[yesterday];
        const foundWords = collapseWordsFromStats(stats[id])

        const data = {"id": JSON.stringify(id)};
        $.get("/get_game_info", data).done(function(data) {
            if (data["success"]) {
                buildYesterdayAnswers(data["result"], foundWords);
            } else {
                var message = data["result"];
                // TODO: create error message
                return
            }
        });
    } else {
        // TODO: create message indicating that yesterday's answers are unavailable
        return
    }
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
