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

/**
* Resets variables 'guesses' and 'currentScore' in session storage.
*/
function resetLocalStorageData() {
    setUncommonWords([]);
    setGuesses([]);
    setCurrentScore(0);
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
* Sets session storage value for 'goalScore'.
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
}

/**
* Retrieves session storage value for 'goalScore'.
*/
function getGoalScore() {
    var goalScore = JSON.parse(localStorage.getItem('goalScore'));
    return goalScore
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

/**
* Assigns thresholds to steps in the progress bar.
*/
function assignThresholds() {
    var best = getGoalScore();
    const percentages = [0, 0.06, 0.14, 0.25, 0.38, 0.55, 0.78, 1];
    $("#progress-bar li").each(function(idx, li) {
        $(li).attr("data-threshold", Math.round(best * percentages[idx]));
    })
}

function updateProgressBar(score) {
    var current = $("#progress-bar li.active");
    while (current.next().data("threshold") < score) {
        current.removeClass("active");
        current = current.next();
    }
    current.addClass("active");
    current.attr("data-before", score);
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
        }
        handleAnimation(results[0], results[1]);
        guesses.push(guess);
        setGuesses(guesses);
        // clear #found-words
        $("#found-words").empty();
        renderGuesses();
        $("#uncommon-words").empty();
        renderUncommonWords();
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

/**
* Adds all previously guessed words to the guesses pane on the website.
*/
function renderGuesses() {
    var currentScore = getCurrentScore();
    var guesses = getGuesses();
    var enumeratedGuesses = enumerateByLength(guesses);
    var enumeratedSolutions = getEnumeratedSolutions();
    var merged = mergeLabels(guesses, enumeratedSolutions);
    var wordLengthCounter = 0;
    for (i = 0; i < merged.length; i++) {
        if (typeof merged[i] == "string") {
            var guess = $('<span />').attr('class', 'guess').html(merged[i][0].toUpperCase() + merged[i].substring(1));
            $("#found-words").append(guess);
            wordLengthCounter++;
        } else {
            var wordLength = merged[i][0];
            var totalQuantity = merged[i][1];
            if (wordLength in enumeratedGuesses) {
                var guessedWords = enumeratedGuesses[wordLength];
            } else {
                var guessedWords = 0;
            }
            while (wordLengthCounter < totalQuantity) {
                $("#found-words").append($('<span />').attr('class', 'guess').html('&nbsp'));
                wordLengthCounter++;
            }
            var info = $('<span />').attr('class', 'info').html(guessedWords + '/' + totalQuantity + " of length " + wordLength);
            $("#found-words").append(info);
            wordLengthCounter = 0;
        }
    }
    updateProgressBar(currentScore);
    return
}

function renderUncommonWords() {
    var uncommonWords = getUncommonWords();
    console.log(uncommonWords)
    for (var i = 0; i < uncommonWords.length; i++) {
        var guess = $('<span />').attr('class', 'guess').html(uncommonWords[i].toUpperCase());
        $("#uncommon-words").append(guess);
    }
    while (i < 10) {
        $("#uncommon-words").append($('<span />').attr('class', 'guess').html('&nbsp'));
        i++;
    }
}

/**
* Loads data from server into session storage.
*/
function loadGameInfo(difficulty = 1) {
    setSolutions();
    setSolutionsFrequencies();
    setEnumeratedSolutions(difficulty);
    setGoalScore();
    assignThresholds();
    setLetters();
    renderGuesses();
    renderUncommonWords();
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

loadGameInfo(1);

console.log(JSON.parse(localStorage.getItem('solutions')));
console.log("Goal score: " + getGoalScore())
