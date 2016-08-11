from __future__ import division
import random
import pandas as pd
import time
from deuces import Evaluator
from deuces import Deck
from deuces import Card

random.seed(2016)
n_sim = 10000
n_game = 200
__debug_mode__ = False
__verbose__ = True
start_time = time.time()

columns_list = ['Id',
                'Hand1', 'Hand2',
                'Board1', 'Board2', 'Board3', 'Board4', 'Board5',
                'Probability1', 'Probability2', 'Probability3', 'Probability4']
result = pd.DataFrame(columns=columns_list)


def prettify_cards(card_ints):
    """
    Expects a list of cards in integer form and return an array of prettified cards.
    """
    output = []
    for i in range(len(card_ints)):
        output += [Card.int_to_pretty_str(card_ints[i])]
    return output


def sim_result(player1, board, evaluator):
    v = 0

    if __debug_mode__:
        print("#################################")
        print("")
        print("")
        print("Board")
        Card.print_pretty_cards(board)
        print("Player hand")
        Card.print_pretty_cards(player1)

    for i in range(n_sim):
        deck_alt = Deck()

        board_d = deck_alt.draw(7)
        player2_d = deck_alt.draw(9)

        # remove duplicate
        board_c = list(board)
        player2 = []

        if len(board_c) < 5:
            for n in range(len(board_d)):
                if board_d[n] not in player1 and board_d[n] not in board_c:
                    board_c.append(board_d[n])
                    if len(board_c) == 5:
                        break

        for n in range(len(player2_d)):
            if player2_d[n] not in player1 and player2_d[n] not in board_c:
                player2.append(player2_d[n])
                if len(player2) == 2:
                    break

        if __debug_mode__:
            print("------------------------------------------------")
            Card.print_pretty_cards(board_c)
            print("Opponent hand")
            Card.print_pretty_cards(player2)

        if evaluator.evaluate(player1, board_c) < evaluator.evaluate(player2, board_c):
            v += 1
            if __debug_mode__:
                print("---->       player win")
        elif __debug_mode__:
                print("---->       player lose or tie")

        if __debug_mode__:
            print(str(v) + "/" + str(n_sim))

    if v > n_sim:
        print("Error in simulation")
    return v/n_sim



evaluator = Evaluator()
for game_number in range(n_game):
    deck = Deck()
    Player1 = []
    Board = []
    Probability = []

    for n_turn in range(4):
        if n_turn == 0:
            Player1 = deck.draw(2)
        elif n_turn == 1:
            Board = deck.draw(3)
        else:
            Board.append(deck.draw(1))

        Probability.append(sim_result(Player1, Board, evaluator))

    line = [int(game_number)] + prettify_cards(Player1) + prettify_cards(Board) + Probability
    result_tmp = pd.DataFrame([line], columns=columns_list)

    if __verbose__:
        print("------------------------------------------------")
        print("Player hand")
        Card.print_pretty_cards(Player1)
        print("Board")
        Card.print_pretty_cards(Board)
        print(Probability)

    print(str(game_number + 1) + ' / {0}'.format(n_game))
    result = result.append(result_tmp)

print("--- %s seconds ---" % (time.time() - start_time))
result.to_csv('Export.csv', index=False, sep=';')
