import random, string
from flask import Flask, render_template, request
from resources import *
from datetime import datetime
import os
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import openai
import json
from random import sample
import pandas as pd

# BASIC FUNCTIONALITY

# A web app that renders a triple of letters (e.g. (A, F, G)).
# Users find words that feature these letters as a substring.
# Points are awarded based on the number of words found, and the lengths of these words.
# Like Wordle and Spelling Bee, these letters are refreshed each day.
# Site tracks user's success rates and scores over time, and possibly shows a leaderboard, or average score for the day.

# DESIGN

# Probably modeled after Spelling Bee, with letter triple on left of screen rendered in some
# gimmicky way (train? bracelet?). Place to type guesses above letter triple.
# Right of screen available for words found by player. Letters from the triple are bolded in found words.
# Some progress bar above set of found words.
# Game title in the top middle, with icons for stats and rules on the upper right. These open modals.

# BACK END

# Probably just one endpoint for the page index?
# Guesses should persist on refresh. This means saving in local storage, or as session info.
# On load, front end should receive homepage info, letter triple, set of solutions.
# When a user makes guesses, these are compared to the solution set, entered into local storage, and printed on screen.

app = Flask(__name__)

load_dotenv()

SQLALCHEMY_DATABASE_URI = "postgresql://{username}:{password}@{hostname}/{databasename}".format(
    username=os.environ.get("db_user"),
    password=os.environ.get("db_password"),
    hostname=os.environ.get("db_host"),
    databasename=os.environ.get("db_name"),
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
openai.api_key = os.environ.get("openai_api_key")


class LetterSets(db.Model):

    __tablename__ = "letter_sets"

    id = db.Column(db.Integer, primary_key=True)
    letters = db.Column(db.String(16))
    date = db.Column(db.Date)


@app.route("/missing_words", methods=["POST"])
def log_missing_words():
    if request.method == 'POST':
        word = request.form.get("word")
        print(word)
        if word:
            with open("missing_words.txt", "a") as f:
                f.write(word)
                f.write("\n")
    return {"success": True}


@app.route("/get_emojis", methods=["GET", "POST"])
def get_emojis():
    if request.method == 'GET':
        guesses = json.loads(request.args.get("guesses"))
        quantity = json.loads(request.args.get("quantity"))
        print(guesses)
        if len(guesses) >= quantity:
            words_to_convert = ', '.join(sample(guesses, quantity))
            message = f"Generate emoji strings for the words in this list: {words_to_convert}. " \
                      f"Each emoji string should consist of at most two emoji that accurately represent a word. " \
                      f"Please use appropriate and relevant emoji. Return a JSON dictionary with exactly {quantity} entries, " \
                      f"where key=emoji string and value=word, and no other text."
            # handle ChatGPT emoji conversion via API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You only provide responses to a given request and no other text. "
                                   "You follow instructions exactly as given. Under NO CIRCUMSTANCES should you return "
                                   "a result that is not in the format of a JSON object."
                    },
                    {"role": "user", "content": message}
                ]
            )
            emojis = response['choices'][0]['message']['content']
            print(emojis)
            try:
                result = json.loads(emojis)
                success = True
            except:
                success = False
                result = "Something went wrong with ChatGPT. This happens because AI isn't in the scary phase yet."

            print(result)
        else:
            result = "Insufficient words to generate emojis."
            success = False
            print(result)
    else:
        success = False
        result = {}
    return {"success": success, "result": result}


@app.route("/", methods=["GET"])
def index():
    # if new day, then generate a new triple and render it on the client side
    # otherwise, access today's triple from database and render it
    #TODO: handle keeping track of used letter triples
    used = []

    today = datetime.today().strftime('%Y-%m-%d')
    query = LetterSets.query.filter_by(date=today).all()
    print("Testing querying...")
    print(query)

    # bypass database for testing
    letters, solution = generate(used, 3)
    common_solution_list = [s for s in solution.keys() if solution[s] != 0]

    '''if query:
        letters = query[0].letters
        print(letters)
        common_solution_list = get_common_solutions_list(letters)
        solution_df = get_solutions_df(letters)
        solution = pd.Series(solution_df['count'].values, index=solution_df['word']).to_dict()
    else:
        letters, solution = generate(used, 3)
        common_solution_list = [s for s in solution.keys() if solution[s] != 0]
        db_letters = ''.join(letters)
        db_entry = LetterSets(letters=db_letters,
                              date=today)
        db.session.add(db_entry)
        db.session.commit()'''

    # generate a suitable letter triple and pass that triple as well as the solution set to the front end
    # and render the homepage
    letters_upper = [x.upper() for x in letters]
    print(common_solution_list)
    return render_template('index.html', results=[letters_upper, common_solution_list, solution])

if __name__ == '__main__':
    app.run(debug=True)