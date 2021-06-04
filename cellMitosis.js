let start = false;

let cells = [];

let cellnum = 0;

let fixCheckBox;

let movementFix = false;

let cellNumInput;

let cellSizeInput;
let cellColorInputR;
let cellColorInputG;
let cellColorInputB;
let cellVelInput;
let cellMitChanceInput;
let cellMutChanceInput;
let cellMutIntensityInput;
let cellLifespanInput;
let cellLimitInput;

function setup() {
  createCanvas(640, 480);
  background(0);
  fill(255);
  text("Press P to start", width/2-60, height/2);

  createSpan('<strong>Fix cell movement:</strong>');

  fixCheckBox = createCheckbox('fixMovement', false);
  fixCheckBox.changed(cellFix);

  createSpan('<br><strong>Initial cell count: </strong>');
  cellNumInput = createInput('');
  cellNumInput.size(50);
  cellNumInput.value(2);
  createSpan('<br><br><strong>Initial cell DNA: </strong>');
  cellSizeInput = createInput('');
  cellSizeInput.size(80);
  cellSizeInput.value(30);
  cellSizeInput.attribute('placeholder', 'Cell size');

  cellColorInputR = createInput('');
  cellColorInputR.size(80);
  cellColorInputR.value(50);
  cellColorInputR.attribute('placeholder', 'R color');

  cellColorInputG = createInput('');
  cellColorInputG.size(80);
  cellColorInputG.value(255);
  cellColorInputG.attribute('placeholder', 'G color');

  cellColorInputB = createInput('');
  cellColorInputB.size(80);
  cellColorInputB.value(50);
  cellColorInputB.attribute('placeholder', 'B color');

  cellVelInput = createInput('');
  cellVelInput.size(80);
  cellVelInput.value(5);
  cellVelInput.attribute('placeholder', 'Cell velocity');

  cellMitChanceInput = createInput('');
  cellMitChanceInput.size(80);
  cellMitChanceInput.value(0.4);
  cellMitChanceInput.attribute('placeholder', 'Cell mitosis chance');

  cellMutChanceInput = createInput('');
  cellMutChanceInput.size(80);
  cellMutChanceInput.value(0.8);
  cellMutChanceInput.attribute('placeholder', 'Cell mutation chance');

  cellMutIntensityInput = createInput('');
  cellMutIntensityInput.size(80);
  cellMutIntensityInput.value(1);
  cellMutIntensityInput.attribute('placeholder', 'Cell mutation intensity');

  cellLifespanInput = createInput('');
  cellLifespanInput.size(80);
  cellLifespanInput.value(60);
  cellLifespanInput.attribute('placeholder', 'Cell lifetime');

  createSpan('<br><br><strong>Cell limit: </strong>');
  cellLimitInput = createInput('');
  cellLimitInput.size(80);
  cellLimitInput.value(400);
  cellLimitInput.attribute('placeholder', 'Cell limit');
}

function draw() {
  if(!start) return;
  background(0);
  if(cellnum >= cellLimitInput.value()) cellnum = 0;
  for (let i = 0; i < cells.length; i++) {
    if(cells[i] == null) continue;
    cells[i].tick();
    cells[i].draw();
  }
  fill(255);
  text(int(frameRate()), 0, 12);
  text(int(cellnum), 0, 12*2);
}

function spawnCells(num, size, color, vel, chance, mutChance, mutIntensity, lifespan) {
  cellnum = num;
  for (let i = 0; i < num; i++) {
    let dna = new DNA(vel, size, color, chance, mutChance, mutIntensity, lifespan);
    cells[i] = new Cell(i, random(width), random(height), dna);
  }
}

function cellFix() {
  movementFix = this.checked();
}

function keyPressed() {
  // Do something
  if(key == 'p' || key == 'P'){
    if(!start){
      spawnCells(cellNumInput.value(), 
      cellSizeInput.value(), 
      [cellColorInputR.value(), cellColorInputG.value(), cellColorInputB.value()], 
      cellVelInput.value(), cellMitChanceInput.value()/100, cellMutChanceInput.value()/100, cellMutIntensityInput.value(), 60*cellLifespanInput.value());
    }
    start = true;
  }
}


class DNA {
  constructor(vel, size, color, mitChance, mutChance, mutIntensity, lifespan){
    this.size = size;
    this.vel = vel;
    this.mutChance = mutChance;
    this.mutIntensity = mutIntensity;
    this.color = color;
    this.mitChance = mitChance;
    this.lifespan = lifespan;
  }

  mutate(){
    this.color = [random(255), random(255), random(255)];
    this.size = abs(randomGaussian(this.size, this.mutIntensity));
    this.mitChance = abs(randomGaussian(this.mitChance, this.mutIntensity/1000));
    print(`Cell mutated with new DNA: Color=${this.color}, Size=${this.size}, MitChance=${this.mitChance}, MutChance=${this.mutChance}`);
  }
}

class Cell {
  constructor(id, x, y, dna) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dna = dna;
    this.lifetime = 0;
  }

  mitosis() {
    let dnaCopy = new DNA(this.dna.vel, this.dna.size, this.dna.color, this.dna.mitChance, this.dna.mutChance, this.dna.mutIntensity, this.dna.lifespan);

    if (random(1) < this.dna.mutChance) {
      dnaCopy.mutate();
    }

    let dir = random(1);
    let xoffset = 0;
    let yoffset = 0;
    if (dir < 0.25) {
      xoffset = this.dna.size;
    } else if (dir < 0.5) {
      xoffset = -this.dna.size;
    } else if (dir < 0.75) {
      yoffset = this.dna.size;
    } else {
      yoffset = -this.dna.size;
    }

    let overlap = false;

    if ((this.x+xoffset < 0 || this.x+xoffset > width) || (this.y+yoffset < 0 || this.y+yoffset > height)) return;
    if(!movementFix){
      for (let i = 0; i < cellnum; i++) {
        if (cells[i].x == this.x+xoffset && cells[i].y == this.y+yoffset) overlap = true;
      }
    }

    if (!overlap) {
      cells[cellnum++] = new Cell(this.id, this.x+xoffset, this.y+yoffset, dnaCopy);
    }
  }

  tick() {
    if(this.dna.lifespan < this.lifetime){
      return;
    }
    
    if(!movementFix){
      this.x += random(-this.dna.vel, this.dna.vel);
      this.y += random(-this.dna.vel, this.dna.vel);
    }

    if (random(1) < this.dna.mitChance) {
      this.mitosis();
    }

    this.x = constrain(this.x, this.dna.size*2, width-this.dna.size*2);
    this.y = constrain(this.y, this.dna.size*2, height-this.dna.size*2);
    
    this.lifetime++;
  }

  draw() {
    if(this.dna.lifespan < this.lifetime){
      return;
    }
    noStroke();
    fill(this.dna.color[0], this.dna.color[1], this.dna.color[2], 150);
    circle(this.x, this.y, this.dna.size);
    stroke(this.dna.color[0], this.dna.color[1], this.dna.color[2], 200);
    fill(this.dna.color[0], this.dna.color[1], this.dna.color[2], 200);
    circle(this.x, this.y, this.dna.size/4);
  }
}
