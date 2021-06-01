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
}

class Cell {
  constructor(id, x, y, dna) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dna = dna;
  }

  mitosis() {
    let colorMut = this.dna.color;
    
    let sizeMut = this.dna.size;
    let mitChanceMut = this.dna.chance;
    
    if (random(1) < this.mutChance) {
      colorMut = [random(255), random(255), random(255)];
      sizeMut += random(-1, 1) * random(this.dna.mutIntensity);
      mitChanceMut += random(-1, 1) * random(this.dna.mutIntensity)/100;
      print("A Cell has mutated");
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

    /*for (int i = 0; i < cellnum; i++) {
      if (cells[i].x == x+xoffset && cells[i].y == y+yoffset) overlap = true;
    }*/
    if (!overlap) {
      let dna = new DNA(this.dna.vel, sizeMut, colorMut, mitChanceMut, this.dna.mutChance, this.dna.mutIntensity, this.dna.lifespan);
      cells[cellnum++] = new Cell(this.id, this.x+xoffset, this.y+yoffset, dna);
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

    constrain(this.x, 0, width);
    constrain(this.y, 0, height);
    
    this.lifetime++;
  }

  draw() {
    if(this.dna.lifespan < this.lifetime){
      print("dead");
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
  
  spawnCells(1, 30, [50, 255, 50], 5, 0.004, 0.03, 10, 60*10);
}

function draw() {
  background(0);
  if(cellnum >= 300) cellnum = 0;
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
    cells[i] = new Cell(i, width/2, height/2, dna);
  }
}


