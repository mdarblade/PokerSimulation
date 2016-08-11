# PokerSimulation
Web app to improve poker probability prediction

The application generate a table simulating the hand of a player and the development of a game of Texas Holdem. At each step where a player would bet in a real game, the python script calculate the probability of winning based on current information using a Monte Carlo technique. The evaluation of which hand is winning is done using the Deuces library (https://github.com/worldveil/deuces).

A translated version of this table is then uploaded to a server, which feed a web application to make an user guess the probabilities calculated in order to adjust the user's perception of the risk at each step of the game. The application is made using jQuery and Bootstrap, with a PHP controller to query the database.
