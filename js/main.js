/** Rename vars */
var Neat    = neataptic.Neat;
var Methods = neataptic.Methods;
var Config  = neataptic.Config;
var Architect = neataptic.Architect;

/** Turn off warnings */
Config.warnings = false;

/** Settings */
var WIDTH            = $('#field').width();
var HEIGHT           = $("#field").height();
var MAX_SPEED        = 5;
var START_X          = WIDTH/2;
var START_Y          = HEIGHT/2;
var SCORE_RADIUS     = 100;

// GA settings
var PLAYER_AMOUNT    = Math.round(2.3e-4 * WIDTH * HEIGHT);
var ITERATIONS       = 250;
var MUTATION_RATE    = 0.4;
var ELITISM          = Math.round(0.3 * PLAYER_AMOUNT);

// Trained population
var USE_TRAINED_POP = false;

/**User settings */
var drawPlayers = true;

$("#drawPlayersCheckbox").prop("checked", true);
$("#drawPlayersCheckbox").change(function(e){
  drawPlayers = $(this).is(":checked");
})
$("#showBestNetwork").prop("checked", true);
$("#showBestNetwork").change(function(e){
  if($(this).is(":checked")){
    $(".best").show();
  }else{
    $(".best").hide();
  }
})
$("#save").click(function(){
  localStorage.setItem("population", JSON.stringify(neat.export()));
})
$("#clear").click(function(){
  localStorage.removeItem("population");
})


/** Global vars */
var neat;

/** Construct the genetic algorithm */
function initNeat(){
  neat = new Neat(
    6, 3,
    null,
    {
      mutation: [
        Methods.Mutation.ADD_NODE,
        Methods.Mutation.SUB_NODE,
        Methods.Mutation.ADD_CONN,
        Methods.Mutation.SUB_CONN,
        Methods.Mutation.MOD_WEIGHT,
        Methods.Mutation.MOD_BIAS,
        Methods.Mutation.MOD_ACTIVATION,
        Methods.Mutation.ADD_GATE,
        Methods.Mutation.SUB_GATE,
        Methods.Mutation.ADD_SELF_CONN,
        Methods.Mutation.SUB_SELF_CONN,
        Methods.Mutation.ADD_BACK_CONN,
        Methods.Mutation.SUB_BACK_CONN
      ],
      popsize: PLAYER_AMOUNT,
      mutationRate: MUTATION_RATE,
      elitism: ELITISM
    }
  );

  if(localStorage.getItem("population")){
    neat.import(JSON.parse(localStorage.getItem("population")));
  }

  // Draw the first graph
  drawGraph(neat.population[0].graph($('.best').width()/2, $('.best').height()/2), '.best');
}

/** Start the evaluation of the current generation */
function startEvaluation(){
  players = [];
  highestScore = 0;

  for(var genome in neat.population){
    genome = neat.population[genome];
    new Player(genome);
  }

  walker.reset();
}

/** End the evaluation of the current generation */
function endEvaluation(){
  console.log('Generation:', neat.generation, '- average score:', Math.round(neat.getAverage()));
  console.log('Fittest score:', Math.round(neat.getFittest().score));

  // Networks shouldn't get too big
  for(var genome in neat.population){
    genome = neat.population[genome];
    genome.score -= genome.nodes.length * SCORE_RADIUS / 10;
  }

  // Sort the population by score
  neat.sort();

  // Draw the best genome
  drawGraph(neat.population[0].graph($('.best').width()/2, $('.best').height()/2), '.best');

  // Init new pop
  var newPopulation = [];

  // Elitism
  for(var i = 0; i < neat.elitism; i++){
    newPopulation.push(neat.population[i]);
  }

  // Breed the next individuals
  for(var i = 0; i < neat.popsize - neat.elitism; i++){
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();

  neat.generation++;
  $("#gen").text(neat.generation)
  startEvaluation();
}
