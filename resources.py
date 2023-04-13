import random
import string
import pandas as pd


def get_letters(used, n=3):
    while True:
        letters = random.choices(string.ascii_lowercase, k=n)
        if letters not in used:
            break
    return letters


def is_subsequence(x, sequence):
    try:
        iterator = iter(sequence)
        for char in x:
            while next(iterator) != char:
                pass
        return True
    except StopIteration:
        return False


def get_solutions(letters):
    letters = ''.join(letters)
    solutions = []
    with open('usa.txt', 'r') as f:
        for line in f:
            if is_subsequence(letters, line):
                solutions.append(line.rstrip())
    return solutions


def get_solutions_df(letters):
    letters = ''.join(letters)
    df = pd.read_csv('oed_no_endings', sep='\t', header=0)
    df = df.drop(labels='amount', axis=1)
    solutions = df[df['word'].apply(lambda x: is_subsequence(letters, x))]
    return solutions


def get_common_solutions_list(letters):
    letters = ''.join(letters)
    df = pd.read_csv('oed_no_endings', sep='\t', header=0)
    df = df.drop(labels='amount', axis=1)
    solutions = df[df['word'].apply(lambda x: is_subsequence(letters, x))]
    solutions = pd.Series(solutions['count'].values, index=solutions['word']).to_dict()
    common_solution_list = [s for s in solutions.keys() if solutions[s] != 0]
    return common_solution_list


def generate(used, n=3):
    while True:
        l = get_letters(used, n)
        sol = get_solutions_df(l)
        if 7 < len(sol[sol['count'] != 0]) < 50:
            break
    return l, pd.Series(sol['count'].values, index=sol['word']).to_dict()

#used = []
#l, sol = generate(used)
#print(l)
#print(sol)