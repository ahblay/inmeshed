import random
import string


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

def generate(used, n=3):
    while True:
        l = get_letters(used, n)
        sol = get_solutions(l)
        if 20 < len(sol) < 100:
            break
    return l, sol

#used = []
#l, sol = generate(used)
#print(l)
#print(sol)