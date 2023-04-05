import pandas as pd


# takes dataframe a that is just a list of words, with title word
def clean_word_list(a):
    a = a.dropna(thresh=1)
    a['word'] = a['word'].apply(lambda x: x.lower())
    return a


# takes two dataframe columns a and b
def intersect_word_lists(a, b):
    a_idx = pd.Index(a)
    b_idx = pd.Index(b)
    intersection = a_idx.intersection(b_idx)
    return intersection.values


def handle_wiki_freq_list(filename):
    # read data into pandas
    df = pd.read_csv(filename, sep='\t', header=0)
    df = df.drop('rank', 1)

    # get rid of rows that contain NaN or None
    df = df.dropna(thresh=2)

    # if an entry contains multiple words, just take the first word
    df['count'] = df['count'].apply(lambda x: x.split(' ')[0])
    df['word'] = df['word'].apply(lambda x: x.split(' ')[0].lower())

    print(df.head())

    # clean scrabble wordlist
    scrabble = pd.read_csv('scrabble.txt', header=0)
    scrabble = clean_word_list(scrabble)

    print(scrabble.head())

    # get intersection of scrabble and frequency wordlists
    intersection = intersect_word_lists(df['word'], scrabble['word'])

    # remove all words that do not appear in scrabble dictionary
    df = df[df['word'].isin(intersection)]
    print(df.head(30000))

    # add scrabble words to frequency list with count = 0
    scrabble_minus_df = scrabble[~scrabble['word'].isin(intersection)]
    complete = pd.concat([df, scrabble_minus_df])
    complete['count'] = complete['count'].fillna(0)
    print(complete.head(50000))

    '''# clean unix wordlist
    unix = pd.read_csv('unix_words.txt', header=0)
    unix = clean_word_list(unix)

    # get intersection of unix and complete wordlists
    intersection = intersect_word_lists(complete['word'], unix['word'])

    # remove all words that do not appear in unix dictionary
    complete = complete[complete['word'].isin(intersection)]'''

    complete.to_csv('tv_scrabble_unix', sep='\t')

    return

handle_wiki_freq_list('tv_freq_list_dirty.txt')
