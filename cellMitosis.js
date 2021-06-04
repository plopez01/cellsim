let start = false;

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

    /*for (let i = 0; i < cellnum; i++) {
      if (cells[i].x == this.x+xoffset && cells[i].y == this.y+yoffset) overlap = true;
    }*/
    if (!overlap) {
      cells[cellnum++] = new Cell(this.id, this.x+xoffset, this.y+yoffset, dnaCopy);
    }
  }

  tick() {
    if(this.dna.lifespan < this.lifetime){
      return;
    }
    
    this.x += random(-this.dna.vel, this.dna.vel);
    this.y += random(-this.dna.vel, this.dna.vel);

    if (random(1) < this.dna.mitChance) {
      this.mitosis();
    }

    constrain(this.x, this.dna.size*2, width-this.dna.size*2);
    constrain(this.y, this.dna.size*2, height-this.dna.size*2);
    
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

let cells = [];

let cellnum = 0;

function setup() {
  createCanvas(640, 480);
  
  spawnCells(1, 30, [50, 255, 50], 5, 0.004, 0.008, 1, 60*15);
}

function draw() {
  if(!start) return;
  background(0);
  if(cellnum >= 600) cellnum = 0;
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

function keyPressed() {
  // Do something
  start = !start;
}