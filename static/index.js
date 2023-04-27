/**
* Calculates the point value of a word based on its frequency.
*/
function calculateWordScore(word) {
    var solutionsFreq = getSolutionsFrequencies();
    var wordFreq = solutionsFreq[word];
    var score = 0;
    var message = '';
    var uncommon = false;
    if (wordFreq > 0) {
        if (wordFreq > 100) {
            score = 1;
            message = "Wow!"
        } else if (wordFreq > 50) {
            score = 2;
            message = "Amazing job!"
        }  else if (wordFreq > 25) {
            score = 3;
            message = "You're a QUEEN."
        } else if (wordFreq > 10) {
            score = 4;
            message = "You must watch a lot of TV."
        } else if (wordFreq > 2) {
            score = 5;
            message = "Yup yup yup."
        } else {
            score = 6;
            message = "Go Giants!"
        }
    } else {
        score = 3;
        message = "Uncommon! (On TV.)"
        uncommon = true;
    }
    return [score, message, uncommon]
}

function objectFlip(obj) {
    return Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = key;
        return ret;
    }, {});
}

/**
* Resets variables 'guesses' and 'currentScore' in session storage.
*/
function resetLocalStorageData() {
    setUncommonWords([]);
    setEmojiDict({});
    resetAllEmojis();
    setGuesses([]);
    setCurrentScore(0);
    setHintStatus(0);
}

function sortGuesses(guesses) {
    guesses.sort(function(a, b) {
        return a.length - b.length || a.localeCompare(b);
    });
    return guesses
}

/**
* Loads in solution set from server and saves to session storage. Calculates goal score and saves to session storage.
*/
function setSolutionsFrequencies() {
    localStorage.setItem('solutionsFrequencies', JSON.stringify(solutionsFreq));
    return
}

/**
* Retrieves session storage value for 'solutions'.
*/
function getSolutionsFrequencies() {
    var solutionsFreq = JSON.parse(localStorage.getItem('solutionsFrequencies'));
    return solutionsFreq
}

/**
* Loads in solution set from server and saves to session storage. Calculates goal score and saves to session storage.
*/
function setSolutions() {
    localStorage.setItem('solutions', JSON.stringify(solutions));
    return
}

/**
* Retrieves session storage value for 'solutions'.
*/
function getSolutions() {
    var solutions = JSON.parse(localStorage.getItem('solutions'));
    return solutions
}

/**
* Loads in game id from server and saves to session storage.
*/
function setGameId() {
    localStorage.setItem('gameId', JSON.stringify(id));
    return
}

/**
* Retrieves session storage value for 'gameId'.
*/
function getGameId() {
    var gameId = JSON.parse(localStorage.getItem('gameId'));
    return gameId
}

function setDateIdDict(date, id) {
    var dateIdDict = JSON.parse(localStorage.getItem('dateIdDict'));
    if (dateIdDict) {
        dateIdDict[date] = id;
        localStorage.setItem('dateIdDict', JSON.stringify(dateIdDict));
    } else {
        var dateIdDict = {};
        dateIdDict[date] = id;
        localStorage.setItem('dateIdDict', JSON.stringify(dateIdDict));
    }
    return
}

function getDateIdDict() {
    var dateIdDict = JSON.parse(localStorage.getItem('dateIdDict'));
    return dateIdDict
}

/**
* Loads in game id from server and saves to session storage.
*/
function setTodayDate() {
    localStorage.setItem('todayDate', JSON.stringify(today));
    return
}

/**
* Retrieves session storage value for 'gameId'.
*/
function getTodayDate() {
    var today = JSON.parse(localStorage.getItem('todayDate'));
    return today
}

/**
* Saves daily stats data to session storage.
*/
function setDailyStats(stats) {
    localStorage.setItem('dailyStats', JSON.stringify(stats));
    return
}

/**
* Retrieves session storage value for 'dailyStats'.
*/
function getDailyStats() {
    var stats = JSON.parse(localStorage.getItem('dailyStats'));
    if (stats) {
        return stats
    } else {
        var stats = {};
        localStorage.setItem('dailyStats', JSON.stringify(stats));
        return stats
    }
}

function initializeDailyStats(id) {
    var stats = getDailyStats();
    if (!stats.hasOwnProperty(id)) {
        var content = {
            'uncommon': [],
            'no-hint': [],
            'one-hint': [],
            'two-hint': []
        }
        stats[id] = content;
        stats[id]['bestScore'] = 0;
        stats[id]['goalScore'] = getGoalScore();

        const level = $("#progress-bar > .active").attr("id");
        const levelName = $("#ranking-" + level + " .level").html();
        stats[id]['levelName'] = levelName;

        setDailyStats(stats);
    }
    return
}

function setUncommonWords(uncommonWords) {
    localStorage.setItem('uncommonWords', JSON.stringify(uncommonWords));
    return
}

function getUncommonWords() {
    var uncommonWords = JSON.parse(localStorage.getItem('uncommonWords'));
    if (uncommonWords) {
        return uncommonWords
    } else {
        var uncommonWords = [];
        localStorage.setItem('uncommonWords', JSON.stringify(uncommonWords));
        return uncommonWords
    }
}

function setEmojiDict(emojiDict) {
    localStorage.setItem('emojiDict', JSON.stringify(emojiDict));
    return
}

function getEmojiDict() {
    var emojiDict = JSON.parse(localStorage.getItem('emojiDict'));
    if (emojiDict) {
        return emojiDict
    } else {
        var emojiDict = {};
        localStorage.setItem('emojiDict', JSON.stringify(emojiDict));
        return emojiDict
    }
}

/**
* Sets the session storage value for 'enumeratedSolutions'.
*/
function setEnumeratedSolutions(difficulty) {
    var solutions = getSolutions();
    enumeratedSolutions = enumerateByLength(solutions);
    Object.keys(enumeratedSolutions).forEach(function(key, index) {
        enumeratedSolutions[key] = Math.ceil(enumeratedSolutions[key] * difficulty);
    });
    localStorage.setItem('enumeratedSolutions', JSON.stringify(enumeratedSolutions));
}

/**
* Retrieves session storage value for 'enumeratedSolutions'.
*/
function getEnumeratedSolutions() {
    var enumeratedSolutions = JSON.parse(localStorage.getItem('enumeratedSolutions'));
    return enumeratedSolutions
}

/**
* Sets the session storage value for 'guesses'.
*/
function setGuesses(guesses) {
    localStorage.setItem('guesses', JSON.stringify(guesses));
}

/**
* Retrieves 'guesses' from session storage if it exists. Otherwise assigns the empty list [] to 'guesses'.
*/
function getGuesses() {
    var guesses = JSON.parse(localStorage.getItem('guesses'));
    if (guesses) {
        guesses = sortGuesses(guesses);
        return guesses
    } else {
        var guesses = [];
        localStorage.setItem('guesses', JSON.stringify(guesses));
        return guesses
    }
    return
}

/**
* Sets the session storage value for 'currentScore'.
*/
function setCurrentScore(currentScore) {
    localStorage.setItem('currentScore', JSON.stringify(currentScore));
    return
}

/**
* Retrieves 'currentScore' from session storage if it exists. Otherwise assigns 0 to 'currentScore'.
*/
function getCurrentScore() {
    var currentScore = JSON.parse(localStorage.getItem('currentScore'));
    if (currentScore != null) {
        return parseInt(currentScore)
    } else {
        var currentScore = 0;
        localStorage.setItem('currentScore', JSON.stringify(currentScore));
        return currentScore
    }
}

/**
* Sets session storage value for 'goalScore'. Also saves goal score for the current day in the daily stats dict
*/
function setGoalScore() {
    var solutions = getSolutions();
    var score = 0;
    for (var i = 0; i < solutions.length; i++) {
        var results = calculateWordScore(solutions[i]);
        score += results[0];
    }
    // score = Object.values(enumeratedSolutions).reduce((a, b) => a + b, 0);
    localStorage.setItem('goalScore', JSON.stringify(score));
    var stats = getDailyStats();
    var id = getGameId();
    stats[id]['goalScore'] = score;
    setDailyStats(stats);
}

/**
* Retrieves session storage value for 'goalScore'.
*/
function getGoalScore() {
    var goalScore = JSON.parse(localStorage.getItem('goalScore'));
    return goalScore
}

/**
* Sets session storage value for 'hintStatus'.
*/
function setHintStatus(hintStatus) {
    localStorage.setItem('hintStatus', JSON.stringify(hintStatus));
}

/**
* Retrieves session storage value for 'hintStatus'.
*/
function getHintStatus() {
    var hintStatus = JSON.parse(localStorage.getItem('hintStatus'));
    if (hintStatus != null) {
        return parseInt(hintStatus)
    } else {
        var hintStatus = 0;
        localStorage.setItem('hintStatus', JSON.stringify(hintStatus));
        return hintStatus
    }
}

/**
* Retrieves session storage value for 'letters'.
*/
function getLetters() {
    var letters = JSON.parse(localStorage.getItem('letters'));
    if (letters != null) {
        return letters
    } else {
        letters = []
        localStorage.setItem('letters', JSON.stringify(letters));
        return letters
    }
}

/**
* Checks if value of 'letters' in session storage matches letter set from server. If not, resets session storage
* variables 'guesses' and 'currentScore', and updates 'letters' to today's set.
*/
function setLetters() {
    var oldLetters = getLetters();
    if (letters.toString() != oldLetters.toString()) {
        resetLocalStorageData();
    }
    localStorage.setItem('letters', JSON.stringify(letters));
    return
}

function getAllEmojis() {
    var allEmojis = JSON.parse(localStorage.getItem('allEmojis'));
    if (allEmojis != null) {
        return allEmojis
    } else {
        allEmojis = null;
        localStorage.setItem('allEmojis', JSON.stringify(allEmojis));
        return allEmojis
    }
}

function setAllEmojis() {
    var allEmojis = getAllEmojis();
    const hint = getHintStatus();
    if (allEmojis != null) {
        if (hint == 0) {
            $("#hint-1").css("display", "inline-block");
        } else if (hint == 1) {
            $("#hint-2").css("display", "inline-block");
        } else {
            $("#hints-used-message").css("display", "inline-block");
        }
        return
    } else {
        $("#hints-loading-message").css("display", "inline-block");
        $("#all-emojis-loading-icon").css("display", "initial");
        var solutions = getSolutions();
        console.log(solutions)
        console.log(solutions.length)
        var data = {"guesses": JSON.stringify(solutions), "quantity": solutions.length};
        $.get("/get_emojis", data).done(function(results) {
            $("#all-emojis-loading-icon").css("display", "none");
            $("#hints-loading-message").css("display", "none");
            console.log(results)
            if (results["success"]) {
                allEmojis = objectFlip(results["result"]);
                localStorage.setItem('allEmojis', JSON.stringify(allEmojis));
                $("#hint-1").css("display", "inline-block");
            } else {
                localStorage.setItem('allEmojis', JSON.stringify(null));
                $("#hint-gpt-error-message").css("display", "inline-block").html(results["result"] + " Try refreshing.");
            }
        });
    }
    return
}

function resetAllEmojis() {
    localStorage.setItem('allEmojis', JSON.stringify(null));
    return
}

/**
* Assigns thresholds to steps in the progress bar.
*/
function assignThresholds() {
    var best = getGoalScore() - 1;
    const percentages = [0, 0.06, 0.14, 0.25, 0.38, 0.55, 0.78, 1];
    $("#progress-bar li").each(function(idx, li) {
        $(li).attr("data-threshold", Math.round(best * percentages[idx]));
    })
}

function addHighlightLevel(level) {
    $("#ranking-" + level).children().addClass("current-ranking");
}

function removeHighlightLevel(level) {
    $("#ranking-" + level).children().removeClass("current-ranking");
}

function updateProgressBar(score) {
    var current = $("#progress-bar li.active");
    var changedLevel = false;
    while (current.next().data("threshold") < score) {
        current.removeClass("active");
        removeHighlightLevel(current.attr("id"));
        current = current.next();
        changedLevel = true;
    }
    current.addClass("active");
    addHighlightLevel(current.attr("id"));
    current.attr("data-before", score);
    if (changedLevel && score >= getGoalScore()) {
        addConfetti("#progress-guess-container");
    }
    return
}

function updateScore(guess) {
    /*
    var guesses = getGuesses();
    var enumeratedGuesses = enumerateByLength(guesses);
    var enumeratedSolutions = getEnumeratedSolutions();
    var currentScore = getCurrentScore();

    if (!(guess.length in enumeratedGuesses) || enumeratedSolutions[guess.length] >= enumeratedGuesses[guess.length]) {
        currentScore++;
        setCurrentScore(currentScore);
        updateProgressBar(currentScore);
    }
    console.log(currentScore);
    */

    var currentScore = getCurrentScore();
    var results = calculateWordScore(guess);
    currentScore += results[0];
    setCurrentScore(currentScore);
    updateProgressBar(currentScore);

    var stats = getDailyStats();
    const id = getGameId();
    stats[id]['bestScore'] = currentScore;

    const level = $("#progress-bar > .active").attr("id");
    const levelName = $("#ranking-" + level + " .level").html();
    stats[id]['levelName'] = levelName;

    setDailyStats(stats);
    console.log(currentScore);
    return
}

function handleAnimation(score, message) {
    $("#points").html("+" + score);
    $("#points-message").html(message);
    $("#points-bug").css("visibility", "visible");
    $("#points-bug").addClass("animation");
    setTimeout(function() {
        $("#points-bug").removeClass("animation");
        $("#points-bug").css("visibility", "hidden");
    }, 1200);
}

// TODO: add this function into the checkWord() flow
// level: (uncommon, -1), (no-hint, 0), (one-hint, 1), (two-hint, 2)
function updateDailyStats(word, level, score) {
    var stats = getDailyStats();
    const id = getGameId();
    var info = [word, score];
    if (level == -1) {
        var levelKey = 'uncommon';
    } else if (level == 0) {
        var levelKey = 'no-hint';
    } else if (level == 1) {
        var levelKey = 'one-hint';
    } else if (level == 2) {
        var levelKey = 'two-hint';
    } else {
        return
    }
    if (stats.hasOwnProperty(id)) {
        // add information under gameID
        stats[id][levelKey].push(info);
    } else {
        // add key and stats info
        // stats[id] =
        var content = {
            'uncommon': [],
            'no-hint': [],
            'one-hint': [],
            'two-hint': []
        }
        content[levelKey].push(info);
        stats[id] = content;
    }
    setDailyStats(stats);
    return
}

/**
* Checks if guess is in solutions and hasn't been guessed yet. If so, appends guess to guesses, updates current score,
* and saves resulting values to session storage.
*/
function checkWord() {
    var guess = $("#guess-input").val().toLowerCase();
    console.log(guess)
    var solutionsFreq = getSolutionsFrequencies();
    var guesses = getGuesses();
    if (guess in solutionsFreq && !(guesses.includes(guess))) {
        var results = calculateWordScore(guess);
        if (results[2]) {
            var uncommonWords = getUncommonWords();
            uncommonWords.push(guess);
            setUncommonWords(uncommonWords);
            updateDailyStats(guess, -1, results[0]);
        } else {
            const hint = getHintStatus();
            updateDailyStats(guess, hint, results[0]);
        }

        handleAnimation(results[0], results[1]);
        guesses.push(guess);
        setGuesses(guesses);
        $("#uncommon-words").empty();
        renderUncommonWords(6);
        // clear #found-words
        $("#found-words").empty();
        renderGuesses();
        updateScore(guess);
        $("#guess-input").val('');
        return true
    } else {
        $("#guess-container").effect("shake");
        return false
    }
}

/**
* Counts all words in groups by length.
*/
function enumerateByLength(array) {
    results = {};
    array = sortGuesses(array);
    console.log(array)
    if (array.length == 0) {
        return results
    } else {
        currentLength = array[0].length;
        counter = 0;
        for (i = 0; i < array.length; i++) {
            if (currentLength != array[i].length) {
                results[currentLength] = counter;
                currentLength = array[i].length;
                counter = 1;
            } else {
                counter++;
            }
        }
        results[currentLength] = counter;
        return results
    }
}

function mergeLabels(sortedList, dict) {
    var result = [];
    var idx = 0;
    for (const [wordLength, quantity] of Object.entries(dict)) {
        while (idx < sortedList.length && sortedList[idx].length <= wordLength) {
            result.push(sortedList[idx]);
            idx++;
        }
        result.push([wordLength, quantity])
    }
    // handling words that are longer than the requirements
    while (idx < sortedList.length) {
        console.log(sortedList[idx])
        result.push(sortedList[idx]);
        if ((idx + 1) == sortedList.length || sortedList[idx].length < sortedList[idx + 1].length) {
            result.push([sortedList[idx].length, 0])
        }
        idx++;
    }

    return result
}

function buildGuessDiv(word, emoji) {
    word = word[0].toUpperCase() + word.substring(1);
    const guessEmoji = $('<span />').attr('class', 'guess-emoji').html(emoji);
    const guess = $('<span />').attr('class', 'guess').html(word);
    const guessEmojiContainer = $('<div />').attr('class', 'guess-emoji-container');
    guessEmojiContainer.append(guess);
    guessEmojiContainer.append(guessEmoji);
    $("#found-words").append(guessEmojiContainer);
    return
}

/**
* Adds all previously guessed words to the guesses pane on the website.
*/
/*
function renderGuesses() {
    var solutions = sortGuesses(getSolutions());
    var allEmojis = getAllEmojis();
    var currentScore = getCurrentScore();
    var guesses = getGuesses();
    var enumeratedGuesses = enumerateByLength(guesses);
    var enumeratedSolutions = getEnumeratedSolutions();
    console.log(enumeratedSolutions)
    var merged = mergeLabels(guesses, enumeratedSolutions);
    var wordLengthCounter = 0;
    var allWordsFound = true;
    for (i = 0; i < merged.length; i++) {
        if (typeof merged[i] == "string") {
            solutions = solutions.filter(e => e !== merged[i]);
            guess = merged[i][0].toUpperCase() + merged[i].substring(1);
            if (allEmojis != null) {
                buildGuessDiv(guess, allEmojis[merged[i]]);
            } else {
                buildGuessDiv(guess, '&nbsp');
            }
            wordLengthCounter++;
        } else {
            var wordLength = merged[i][0];
            var totalQuantity = merged[i][1];
            if (wordLength in enumeratedGuesses) {
                var guessedWords = enumeratedGuesses[wordLength];
            } else {
                var guessedWords = 0;
            }
            var solutionsByLength = solutions.filter(e => e.length == wordLength);
            var solutionsIdxCounter = 0;
            while (wordLengthCounter < totalQuantity) {
                if (allEmojis != null) {
                    emoji = allEmojis[solutionsByLength[solutionsIdxCounter]];
                    buildGuessDiv('&nbsp', emoji);
                } else {
                    buildGuessDiv('&nbsp', '&nbsp');
                }
                allWordsFound = false;
                wordLengthCounter++;
                solutionsIdxCounter++;
            }
            var info = $('<span />').attr('class', 'info').html(guessedWords + '/' + totalQuantity + " of length " + wordLength);
            $("#found-words").append(info);
            wordLengthCounter = 0;
        }
    }
    if (allWordsFound) {
        if ($("#uncommon-words").hasClass("bg-confetti-animated")) {
            if ($("#progress-guess-container").hasClass("bg-confetti-animated")) {
                removeConfetti("#uncommon-words");
                removeConfetti("#progress-guess-container");
                addConfetti("#main-content-container");
            }
        }
    }
    updateProgressBar(currentScore);
    return
}
*/

function generateRenderedGuesses(guesses, solutions) {
    var guessesDict = {};
    for (var i = 0; i < guesses.length; i++) {
        solutions = solutions.filter(e => e !== guesses[i]);
        var found = [guesses[i], "guess"];
        if (guessesDict.hasOwnProperty(found[0].length)) {
            guessesDict[found[0].length].push(found);
        } else {
            var listByLength = [found];
            guessesDict[found[0].length] = listByLength;
        }
    }
    for (var i = 0; i < solutions.length; i++) {
        var missing = [solutions[i], "solution"];
        if (guessesDict.hasOwnProperty(missing[0].length)) {
            guessesDict[missing[0].length].push(missing);
        } else {
            var listByLength = [missing];
            guessesDict[missing[0].length] = listByLength;
        }
    }
    return guessesDict;
}

function renderGuesses() {
    // generate a dict with the following format:
    // renderedGuesses = {length (int): [word1, word2, ..., wordn]}
    var guesses = getGuesses();
    var solutions = sortGuesses(getSolutions());
    var renderedGuesses = generateRenderedGuesses(guesses, solutions);
    console.log(renderedGuesses)

    var enumeratedSolutions = getEnumeratedSolutions();
    var currentScore = getCurrentScore();

    var allEmojis = getAllEmojis();
    const hintStatus = getHintStatus();
    // add new guess to renderedGuesses

    const lengths = Object.keys(renderedGuesses);
    lengths.forEach((wordLength) => {
        var guessesByLength = renderedGuesses[wordLength];
        for (var i = 0; i < guessesByLength.length; i++) {
            var guess = guessesByLength[i][0];
            var guessType = guessesByLength[i][1];
            if (guessType == 'guess') {
                if (allEmojis != null && hintStatus > 0 && allEmojis.hasOwnProperty(guess)) {
                    if (hintStatus == 2) {
                        var emoji = allEmojis[guess];
                    } else {
                        var emoji = allEmojis[guess].substring(0, hintStatus + 1);
                    }
                    // adjacent emoji hint
                    // buildGuessDiv(guess, emoji);
                    buildGuessDiv(guess, '&nbsp');

                } else {
                    buildGuessDiv(guess, '&nbsp');
                }
            } else {
                if (allEmojis != null && hintStatus > 0 && allEmojis.hasOwnProperty(guess)) {
                    if (hintStatus == 2) {
                        var emoji = allEmojis[guess];
                    } else {
                        var emoji = allEmojis[guess].substring(0, hintStatus + 1);
                    }
                    // adjacent emoji hint
                    // buildGuessDiv('&nbsp', emoji);
                    buildGuessDiv(emoji, '&nbsp');
                } else {
                    // adjacent emoji hint
                    // buildGuessDiv('&nbsp', '&nbsp');
                    buildGuessDiv('&nbsp', '&nbsp');
                }
            }
        }
        var nonEmptyGuesses = guessesByLength.filter(e => e[1] == 'guess');
        if (typeof enumeratedSolutions[wordLength] === "undefined") {
            var totalQuantity = 0;
        } else {
            var totalQuantity = enumeratedSolutions[wordLength];
        }
        var info = $('<span />').attr('class', 'info').html(nonEmptyGuesses.length + '/' + totalQuantity + " of length " + wordLength);
        $("#found-words").append(info);
    });

    updateProgressBar(currentScore);
    return
}

function renderUncommonWords(goal) {
    var uncommonWords = getUncommonWords();
    for (var i = 0; i < uncommonWords.length; i++) {
        var guess = $('<span />').attr('class', 'guess').html(uncommonWords[i].toUpperCase());
        $("#uncommon-words").append(guess);
    }
    while (i < goal) {
        $("#uncommon-words").append($('<span />').attr('class', 'guess').html('&nbsp'));
        i++;
    }
    if (uncommonWords.length >= goal && !($("#uncommon-words").hasClass("bg-confetti-animated"))) {
        addConfetti("#uncommon-words");
    }
}

function addConfetti(selector) {
    $(selector).addClass("bg-confetti-animated");

    setTimeout(function() {
        $(selector).removeClass("bg-confetti-animated");
    }, 5000);

}

function removeConfetti(selector) {
    $(selector).removeClass("bg-confetti-animated");
}

function assignThresholdsToModal() {
    var one = $("#one").data("threshold");
    var two = $("#two").data("threshold");
    var three = $("#three").data("threshold");
    var four = $("#four").data("threshold");
    var five = $("#five").data("threshold");
    var six = $("#six").data("threshold");
    var seven = $("#seven").data("threshold");
    var eight = $("#eight").data("threshold");
    $("#ranking-one .threshold").text(one);
    $("#ranking-two .threshold").text(two + 1);
    $("#ranking-three .threshold").text(three + 1);
    $("#ranking-four .threshold").text(four + 1);
    $("#ranking-five .threshold").text(five + 1);
    $("#ranking-six .threshold").text(six + 1);
    $("#ranking-seven .threshold").text(seven + 1);
    $("#ranking-eight .threshold").text(eight + 1);
}


/**
* Loads data from server into session storage.
*/
function loadGameInfo(difficulty = 1) {
    setTodayDate();
    setGameId();
    setDateIdDict(getTodayDate(), getGameId());
    initializeDailyStats(getGameId());
    setSolutions();
    setSolutionsFrequencies();
    setEnumeratedSolutions(difficulty);
    setGoalScore();
    assignThresholds();
    assignThresholdsToModal();
    setLetters();

    renderUncommonWords(6);
    renderGuesses();
    setAllEmojis();
    letterHighlighter();
    return
}

function handleWordInput(event) {
    const updatedInputText = $('#guess-input').val().replace(/[^A-Za-z]+/g, "").toUpperCase();
    $('#guess-input').val(updatedInputText);
}

function letterHighlighter() {
    const word = $('#guess-input').val();

    let pattern = '';
    let stopMatching = false;

    $('#letters-container').children().each(function(idx) {
        const letterValue = $(this).text();

        if (!stopMatching) {
            pattern += `.*${letterValue}`;

            if (new RegExp(pattern).test(word)) {
                $(this).addClass('highlighted');
            } else {
                stopMatching = true;
            }
        }

        if (stopMatching) {
            $(this).removeClass('highlighted');
        }
    });
}

function handleWordSubmission(event) {
    if (checkWord()) {
        $(".highlighted").removeClass("highlighted");
    }
}

function deleteDailyProgress() {
    resetLocalStorageData();
    $(".current-ranking").removeClass("current-ranking");
    $("#progress-bar li.active").removeClass("active");
    $("#one").addClass("active");
    addHighlightLevel("one");
    $("#emojis").empty();
    $("#found-words").empty();
    renderGuesses();
    $("#i-told-you-so-modal").css("display", "block");
    $("#guess-input").val("");
    $(".highlighted").removeClass("highlighted");
    var stats = getDailyStats();
    const id = getGameId();
    delete stats[id];
    setDailyStats(stats);
    initializeDailyStats(id);
    removeConfetti("#uncommon-words");
    removeConfetti("#progress-guess-container");
    $("#uncommon-words").empty();
    renderUncommonWords(6);

    $("#hint-1").css("display", "inline-block");
    $("#hint-2").css("display", "none");
    $("#hints-used-message").css("display", "none");
}

function logMissingWord() {
    var word = $("#guess-input").val().toLowerCase();
    if (word == "scrumplethorpe") {
        deleteDailyProgress();
        return
    }
    $.post("/missing_words", {"word": word});
    $("#guess-input").val("");
    $(".highlighted").removeClass("highlighted");
    $("#guess-input").focus();
}

function findLevel() {
    const id = $("#progress-bar > .active").attr("id");
    const referenceDict = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8
    }
    return referenceDict[id]
}

function buildShareableEmojis(emojiDict) {
    const letters = getLetters().join(' ');
    const lettersDiv = $('<div />').attr('class', 'shareable-content').html(letters);
    $("#emojis").append(lettersDiv);
    for (const [key, value] of Object.entries(emojiDict)) {
        const tooltipText = value;
        const shareableDiv = $('<div />').attr("data-text", tooltipText).html(key);
        $(shareableDiv).addClass('shareable-content');
        $(shareableDiv).addClass('tooltip left');
        $("#emojis").append(shareableDiv);
        /*
        const emojiContainer = $('<div />').attr('class', 'emoji-container');
        emojiContainer.append($('<span />').css('text-align', 'right').html(key));
        emojiContainer.append($('<span />').css('text-align', 'center').html(" : "));
        emojiContainer.append($('<span />').css('text-align', 'left').html(value));
        $("#emojis").append(emojiContainer);
        */
    }
    return
}

function getEmojis() {
    const guesses = getGuesses();
    const emojiDict = getEmojiDict();
    const level = findLevel();
    var quantity;
    if (level < 3) {
        quantity = 0;
    } else {
        quantity = level - 2;
    }
    $("#emojis").empty();
    if (quantity == 0) {
        const message = "Insufficient words to generate emojis. You must reach level 3."
        $("#emojis").append($('<div />').attr('class', 'desc').html(message));
        return
    } else if (Object.keys(emojiDict).length == quantity) {
        buildShareableEmojis(emojiDict);
        return
    } else {
        $("#emoji-loading-icon").css("display", "initial");
        const data = {"guesses": JSON.stringify(guesses), "quantity": quantity};
        $.get("/get_emojis", data).done(function(data) {
            $("#emoji-loading-icon").css("display", "none");
            if (data["success"]) {
                var emojis = data["result"];
                buildShareableEmojis(emojis);
                setEmojiDict(emojis);
            }
            else {
                $("#emojis").append($('<div />').attr('class', 'desc').html(data["result"]));
            }
        });
    }
}

$("#guess-input").keyup(function(event) {
    // Handling for when user hits enter.
    if (event.key == "Enter") {
        if (checkWord()) {
            $(".highlighted").removeClass("highlighted");
        }
    }
    return false
})

/*
* Prevent using arrow keys to move cursor
*/
$("#guess-input").keydown(function(event){
    if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
        event.preventDefault();
    }
});

/*
* Prevent clicking to move cursor
*/
$("#guess-input").mousedown(function(event) {
    $(this).focus();
    const inputValueLength = $(this).val().length;
    $(this)[0].selectionStart = inputValueLength;
    return false
})

$(function() {
    $("#guess-input").focus();
});

$("#hint-1").click(function() {
   $(this).css("display", "none");
   $("#hint-2").css("display", "inline-block");
   setHintStatus(1);
   $("#found-words").empty();
   renderGuesses();
});

$("#hint-2").click(function() {
   $(this).css("display", "none");
   $("#hints-used-message").css("display", "inline-block");
   setHintStatus(2);
   $("#found-words").empty();
   renderGuesses();
});

loadGameInfo(1);

console.log(JSON.parse(localStorage.getItem('solutions')));
console.log("Goal score: " + getGoalScore())
