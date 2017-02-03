// global array to list words
var wordList = [];

// loop through wordList, creating <li> tags that contain
// the word and buttons for each possible likeness score
function redraw() {
    $('#wordList').empty();
    calculateLikenesses();
    for (let i = 0; i < wordList.length; i++) {
        let input = wordList[i];
        // append <li> to wordList
        $('#wordList').append('<li id="li_' + input.word + '">' + input.word + '</li>');
        // append buttons to the <li> for the word's possible likeness scores
        for (let j = 0; j < input.likenesses.length; j++) {
            // add likeness score button
            $('#li_' + input.word).append('  <button type="button" class="btn" id="li_btn_' + input.word + '_' + input.likenesses[j] + '">' + input.likenesses[j] + '</btn>');
            // add button's click function
            $('#li_btn_' + input.word + '_' + input.likenesses[j]).click(function() {
                guess(input.word, input.likenesses[j]);
            });
        }
    }
    if (wordList.length === 1) {
        $('#li_' + wordList[0].word).css('background-color', 'chartreuse').css('color', 'black').append(' IS THE PASSWORD');
        $('#prompt').html('Click Reset to start over');

    }
}

function calculateLikenesses() {
    // calculate each word's possible likeness scores
    for (var i = 0; i < wordList.length; i++) {
        wordList[i].likenesses = [];
        for (var j = 0; j < wordList.length; j++) {
            if (i !== j) {
                var likeness = likenessCalc(wordList[i].word, wordList[j].word);
                if (!wordList[i].likenesses.includes(likeness)) {
                    wordList[i].likenesses.push(likeness);
                }
            }
        }
        // sort likeness scores for viewing
        wordList[i].likenesses.sort(function(a, b) {
            if (a < b) {
                return -1;
            }
            else if (b < a) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }
}

function guess(guessWord, guessLikeness) {
    guessWord = guessWord.toUpperCase();
    for (var i = wordList.length - 1; i >= 0; i--) {
        if (wordList[i].word === guessWord) {
            wordList[i].likenesses = [guess];
        }
        if (likenessCalc(guessWord, wordList[i].word) !== guessLikeness) {
            wordList.splice(i, 1);
        }
    }
    redraw();
}

function wordListIndexOf(word) {
    for (var i = 0; i < wordList.length; i++) {
        if (wordList[i].word === word) {
            return i;
        }
    }
    return -1;
}

$(document).ready(function() {
    $('#clues').focus();
});

// naive likeness function - behavior is undefined
// when word1.length != word2.length
function likenessCalc(word1, word2) {
    var likeness = 0;
    for (var i = 0; i < word1.length; i++) {
        if (word1[i] === word2[i]) {
            likeness++;
        }
    }
    return likeness;
}

$('#start').click(function() {
    // clear wordList from any previous
    wordList = [];

    // ensure the textarea isn't blank
    if ($('#clues').val().trim() === '') {
        alert('You haven\'t entered any words.');
        return;
    }

    // ensure all words are the same length
    var inputs = $('#clues').val().trim().split('\n');
    var wordLength = inputs[0].trim().length;
    for (var i = 1; i < inputs.length; i++) {
        if (inputs[i].trim().length != wordLength) {
            alert('Words are not all the same length');
            return;
        }
    }

    // all words are the same length - hide inputs,
    $("#input").hide();

    // fill wordList global with the entered words
    for (var i = 0; i < inputs.length; i++) {
        var input = {word: inputs[i].trim().toUpperCase(), likenesses: []};
        if (wordListIndexOf(input.word) == -1) {
            wordList.push(input);
        }
    }

    // redraw
    redraw();

    // show hacking interface
    inputVisible(false);
});

function inputVisible(bool) {
    if (bool) {
        $('#input').show();
        $('#hacking').hide();
        $('#prompt').hide();
    }
    else {
        $('#input').hide();
        $('#hacking').show();
        $('#prompt').show().html('Select the likeness score of a word to continue');
    }
}

// assign functionality to the reset button
$(document).ready(function() {
    $('#reset').click(function() {
        wordList = [];
        redraw();
        inputVisible(true);
    });
});
