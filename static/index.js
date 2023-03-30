/**
* Calculates the point value of a word based on its length.
*/
function calculateWordScore(word) {
    var score = 0;
    if (word.length == 3) {
        score += 1;
    } else if (word.length == 4) {
        score += 2;
    } else if (word.length == 5) {
        score += 3;
    } else if (word.length == 6) {
        score += 4;
    } else if (word.length == 7) {
        score += 4;
    } else if (word.length == 8) {
        score += 3;
    } else if (word.length == 9) {
        score += 2;
    } else if (word.length >= 10) {
        score += 1;
    }
    return score
}

/**
* Resets variables 'guesses' and 'currentScore' in session storage.
*/
function resetLocalStorageData() {
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
function setGoalScore(enumeratedSolutions) {
    score = Object.values(enumeratedSolutions).reduce((a, b) => a + b, 0);
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
    console.log(oldLetters)
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
    var percentage = 0;
    $("#progress-bar li").each(function(idx, li) {
        $(li).attr("data-threshold", Math.round(best * percentage));
        percentage += 0.142857;
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
    return
}

/**
* Checks if guess is in solutions and hasn't been guessed yet. If so, appends guess to guesses, updates current score,
* and saves resulting values to session storage.
*/
function checkWord() {
    var guess = $("#guess-input").val();
    var solutions = getSolutions();
    var guesses = getGuesses();
    if (solutions.includes(guess) && !(guesses.includes(guess))) {
        guesses.push(guess);
        setGuesses(guesses);
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

/**
* Loads data from server into session storage.
*/
function loadGameInfo(difficulty = 1) {
    setSolutions();
    setEnumeratedSolutions(difficulty);
    setGoalScore(getEnumeratedSolutions());
    assignThresholds();
    setLetters();
    renderGuesses();
    return
}

/**
* Code for highlighting letters on user input.
*/
var indexForTypedLetters = 0;
var enteredWord = [];
$("#guess-input").keydown(function(event) {
    var letters = getLetters();
    const t = event.target;
    // Handling for when user hits enter.
    if (event.key == "Enter") {
        if (checkWord()) {
            $(".highlighted").removeClass("highlighted");
            indexForTypedLetters = 0;
            enteredWord = [];
        }
    // If backspace of delete, check if deleted letter is the last occurrence of that letter in the guessed word.
    // If so, remove 'highlighted' class from corresponding letter.
    } else if (event.keyCode === 8) { // for backspace key
        var deletedLetter = t.value[t.selectionStart - 1].toUpperCase();
        if (deletedLetter == enteredWord.pop()) {
            var targetedLetter = document.getElementById('letters-container').children.item(indexForTypedLetters - 1);
            $(targetedLetter).removeClass("highlighted");
            indexForTypedLetters--;
        }
    } else if (event.keyCode === 46) { // for delete key
        var deletedLetter = t.value[t.selectionStart - 1].toUpperCase();
        if (deletedLetter == enteredWord.pop()) {
            var targetedLetter = document.getElementById('letters-container').children.item(indexForTypedLetters - 1);
            $(targetedLetter).removeClass("highlighted");
            indexForTypedLetters--;
        }
    // If typed letter matches one of the mandatory letters, add 'highlighted' class to corresponding div.
    } else if (letters[indexForTypedLetters] == event.key.toUpperCase()) {
        var targetedLetter = document.getElementById('letters-container').children.item(indexForTypedLetters);
        $(targetedLetter).addClass("highlighted");
        indexForTypedLetters++;
        enteredWord.push(event.key.toUpperCase());
        /*
        if ($("div.letter:contains('" + event.key.toUpperCase() + "')").closest(".letter").hasClass("highlighted")) {
            console.log("inside second conditional")
            $("div.letter:contains('" + event.key.toUpperCase() + "')").addClass("highlighted");
        }
        */
    // Test to ensure that user only inputs english letters, and that action keys (tab, shift, etc.) are disregarded.
    } else if (/[a-z]/.test(event.key) && event.key.length === 1) {
        enteredWord.push(event.key.toLowerCase());
    }
    return /[a-z]/.test(event.key)
});

$(function() {
    $("#guess-input").focus();
});

loadGameInfo(0.3);

console.log(JSON.parse(localStorage.getItem('solutions')));
console.log("Goal score: " + getGoalScore())
