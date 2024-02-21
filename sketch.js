let bugs = [];
let squishedBugs = 0;
let timeLeft = 30;
let bugSprite;
let squishedBugSprite;
let timerInterval;

function preload() {
  bugSprite = loadImage('assets/bug.png');
  squishedBugSprite = loadImage('assets/squished_bug.png');
}

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 5; i++) {
    bugs.push(new Bug());
  }
  timerInterval = setInterval(countdown, 1000);
}

function draw() {
  background(220);
  
  // Display bugs
  for (let bug of bugs) {
    bug.move();
    bug.display();
  }
  
  // Display squished bugs count
  textSize(20);
  fill(0);
  text("Squished Bugs: " + squishedBugs, 10, 30);
  
  // Display timer
  text("Time left: " + timeLeft, width - 150, 30);
  
  // Check for game over
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    textSize(40);
    text("Game Over", width/2 - 100, height/2);
  } 
  else { // Add an else block to continuously spawn bugs until timer ends
    if (frameCount % 60 === 0) { // Spawn a bug every second
      bugs.push(new Bug());
    }
  }
}

function mousePressed() {
  for (let i = bugs.length - 1; i >= 0; i--) {
    if (bugs[i].contains(mouseX, mouseY)) {
      bugs.splice(i, 1);
      squishedBugs++;
      bugs.push(new Bug());
      break;
    }
  }
}

function countdown() {
  timeLeft--;
}


class Bug {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(1, 3);
    this.angle = random(TWO_PI);
    this.frameIndex = 0; // Index of the current frame in the sprite
    this.frameWidth = 100; // Width of each frame in the sprite
    this.frameHeight = 80; // Height of the sprite
    this.totalFrames = 3; // Total number of frames in the sprite
    this.lastFrameChange = millis(); // Time when the frame was last changed
    this.frameDuration = 100; // Duration (in milliseconds) for each frame
  }
  
  move() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
    
    // Bounce off edges
    if (this.x < 0 || this.x > width) {
      this.angle = PI - this.angle;
    }
    if (this.y < 0 || this.y > height) {
      this.angle = -this.angle;
    }
  }
  
  display() {
    // Check if it's time to change the frame
    if (millis() - this.lastFrameChange > this.frameDuration) {
      this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
      this.lastFrameChange = millis();
    }
    
    // Calculate the position and width of the current frame in the sprite
    let sx = this.frameIndex * this.frameWidth;
    let sy = 0; // Since all frames are in the same row
    let sw = this.frameWidth;
    let sh = this.frameHeight;
    
    // Draw only the current frame
    image(bugSprite, this.x, this.y, sw, sh, sx, sy, sw, sh);
  }
  
  contains(px, py) {
    let d = dist(px, py, this.x + this.frameWidth / 2, this.y + this.frameHeight / 2);
    if (d < this.frameWidth / 2) {
      return true;
    } else {
      return false;
    }
  }
}
