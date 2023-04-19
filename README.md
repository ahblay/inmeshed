# InMeshed

This project is a web app for a word game called "InMeshed." Each day, users are presented with a sequence of letters (e.g. [A, G, L]) and tasked with finding all words that contain these letters in order (e.g. wrAnGLe). User progress is tracked with a progress bar, and missing words are shown by length. The website is live at http://inmeshed.pythonanywhere.com/. 

## Description

### Basic Functionality

This is a web app that renders a triple of letters (e.g. (A, F, G)). Users find words that feature these letters as a subsequence. Points are awarded based on the number of words found. Like Wordle and Spelling Bee, these letters are refreshed each day. Site tracks user's success rates and scores over time, and possibly shows a leaderboard, or average score for the day.

### Design

Modeled after Spelling Bee, with letter triple on left of screen. Input field to type guesses above letter triple. Right of screen available for words found by player and progress bar above set of found words.

### Back End

One endpoint for the page index. Guesses persist on refresh. This means saving in local browser storage. On load, front end receives homepage info, letter triple, set of solutions. When a user makes guesses, these are compared to the solution set, entered into local storage, and printed on screen.

## Getting Started

If you want to play around with this, feel free. To run web app locally, install dependencies and run flask app with the following code:

```
pip freeze > requirements.txt
python app.py
```

To use the database functionality, you'll need to install postgresql and initialize a database table from the command line with columns `id`, `letters`, and `date`. You'll also need to create a .env file in the main project directory that contains the database URI information (username, password, hostname, and database_name). 

You can bypass the database by uncommenting line 71 in app.py and commenting out the entire conditional block. This will force the website to refresh letter sets on reload. 

## Authors

Contributors names and contact info

Abel Romer  
[Website](https://ww.abelromer.com)

## Acknowledgments

Spelling Bee and Wordle, of course.
* [Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee)
* [Wordle](https://www.nytimes.com/games/wordle/index.html)
