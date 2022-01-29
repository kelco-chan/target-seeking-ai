# A fork of the original target seeking AI
### Changes made:
* Agents now earn the maximum score by sticking to the blue circle of the target
* All vector quantities (velocity, position) given to the agent are represented in polar coordinates to speed up evolution
* Agents are given the angle of their velocity and the 
* 2 memory slots are added that the agent can read/write to
* Restyled webpage
* Added `draw players` checkbox to speed up training
* Added save/restore functionality to localstorage
* Changed a few GA settings (elitism & mutation rate)

# [Original README]
This repository shows how you can use [Neataptic](https://github.com/wagenaartje/neataptic) to succesfully teach neural networks to trace targets. You can see the genomes live in action [here](https://wagenaartje.github.io/target-seeking-ai/). These genomes have been trained for over 100 generations and are very effective. Visualisation done with [P5.js](https://p5js.org/). The next step would be adding collisions, to possibly reveal some interesting tactics.

[Read an article on this repo here](https://wagenaartje.github.io/neataptic/articles/targetseeking/).

These forks of this library are interesting to check out as well:

* [corpr8's fork](https://corpr8.github.io/neataptic-targetseeking-tron/)
gives each neural agent its own acceleration, as well as letting each arrow
remain in the same place after each generation. This creates a much more
'fluid' process.

## Settings
If you manage to optimize the settings, please perform either a pull request or create an issue [here](https://github.com/wagenaartje/neataptic/issues). 

#### Settings (contained in `js/main.js`):
* `WIDTH` set the width of the playing field
* `HEIGHT` set the height of the playing field
* `MAX_SPEED` set the maximal multiplier speed a genome can have (smaller genomes move faster)
* `START_X` set the x-location from which each genome (and the target) starts
* `START_Y` set the y-location from which each genome (and the target) starts
* `SCORE_RADIUS` set the distance to the target from where genomes get assigned score
* `PLAYER_AMOUNT` set the amount of genomes that play on the field (population size)
* `ITERATIONS` set the amount of iterations/frames each generation is tested for
* `START_HIDDEN_SIZE` set the amount of hidden nodes each genome starts witch
* `MUTATION_RATE` set the mutation rate
* `ELITISM` set the amount of elitism
