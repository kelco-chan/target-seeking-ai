function Player(genome){
  this.x = START_X;
  this.y = START_Y;
  this.vx = 0;
  this.vy = 0;
  this.r = 6;

  this.mem1 = 0;
  this.mem2 = 0;

  this.brain = genome;
  this.brain.score = 0;

  players.push(this);
}

Player.prototype = {
  /** Update the stats */
  update: function(){
    var input = this.detect();
    var output = this.brain.activate(input);

    var moveangle = output[0] * 2 * PI;

    this.mem1 = output[1];
    this.mem2 = output[2];

    // Calculate next position
    this.ax = Math.cos(moveangle);
    this.ay = Math.sin(moveangle);
    this.vx += this.ax;
    this.vy += this.ay;

    // Limit speeds to maximum speed
    this.vx = this.vx > MAX_SPEED ? MAX_SPEED : this.vx < -MAX_SPEED ? -MAX_SPEED : this.vx;
    this.vy = this.vy > MAX_SPEED ? MAX_SPEED : this.vy < -MAX_SPEED ? -MAX_SPEED : this.vy;

    this.x += this.vx;
    this.y += this.vy;

    // Limit position to width and height
    this.x = this.x >= WIDTH  ? WIDTH  : this.x <= 0 ? 0 : this.x;
    this.y = this.y >= HEIGHT ? HEIGHT : this.y <= 0 ? 0 : this.y;

    if(this.x == 0 || this.x == WIDTH) this.vx = -this.vx;
    if(this.y == 0 || this.y == HEIGHT) this.vy = -this.vy;

    this.score();
  },

  /** Calculate fitness of this players genome **/
  score: function(){
    var dist = distance(this.x, this.y, walker.x, walker.y);
    if(!isNaN(dist) && dist < SCORE_RADIUS){
      this.brain.score += SCORE_RADIUS - Math.abs(SCORE_RADIUS/2 - dist);
    }

    // Replace highest score to visualise
    highestScore = this.brain.score > highestScore ? this.brain.score : highestScore;
  },

  /** Display the player on the field, parts borrowed from the CodingTrain */
  show: function(){
    // Draw a triangle rotated in the direction of velocity
    var angle = angleToPoint(this.x, this.y, this.x + this.vx, this.y + this.vy) + HALF_PI;
    var color = activationColor(this.brain.score, highestScore);

    push();
    translate(this.x, this.y);
    rotate(angle);

    fill(color);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  },

  /** Detect and normalize inputs */
  detect: function(){
    var dist = Math.sqrt(this.x, this.y, walker.x, walker.y) / Math.sqrt(WIDTH**2 + HEIGHT**2);
    var targetAngle = angleToPoint(this.x, this.y, walker.x, walker.y) / TWO_PI;
    var vang = Math.atan(this.vy / this.vx);
    var v = Math.sqrt(this.vx ** 2 + this.vy ** 2) / MAX_SPEED / Math.SQRT2;
    var mem1 = Math.max(-1, Math.min(1, this.mem1))
    var mem2 = Math.max(-1, Math.min(1, this.mem2))
    //var tvang = Math.atan(walker.vy / walker.vx);;
    //var tv = Math.sqrt(walker.vx ** 2 + walker.vy ** 2) / MAX_SPEED / Math.SQRT2;

    return [vang || 0, v || 0, /*tvang || 0, tv || 0,*/ targetAngle || 0, dist || 0, mem1 || 0, mem2 || 0];
  },
};
