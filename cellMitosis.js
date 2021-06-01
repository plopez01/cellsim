class Cell {
  constructor(id, x, y, vel, size, r, g, b, chance, mutChance, mutIntensity, deathtime) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = size;
    this.vel = vel;
    this.chance = chance;
    this.mutChance = mutChance;
    this.mutIntensity = mutIntensity;
    this.deathtime = deathtime;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  mitosis() {
    let newR = this.r;
    let newG = this.g;
    let newB = this.b;
    
    let newSize = this.size;
    let newChance = this.chance;
    let newmutChance = this.mutChance;
    
    if (random(1) < this.mutChance) {
      newR = int(random(255));
      newG = int(random(255));
      newB = int(random(255));
      newSize += random(-1, 1) * random(this.mutIntensity);
      newChance += random(-1, 1) * random(this.mutIntensity)/100;
      newmutChance += random(-1, 1) * random(this.mutIntensity)/100;
      print("A Cell has mutated");
    }

    let dir = random(1);
    let xoffset = 0;
    let yoffset = 0;
    if (dir < 0.25) {
      xoffset = this.size;
    } else if (dir < 0.5) {
      xoffset = -this.size;
    } else if (dir < 0.75) {
      yoffset = this.size;
    } else {
      yoffset = -this.size;
    }

    let overlap = false;

    if ((this.x+xoffset < 0 || this.x+xoffset > width) || (this.y+yoffset < 0 || this.y+yoffset > height)) return;

    /*for (int i = 0; i < cellnum; i++) {
      if (cells[i].x == x+xoffset && cells[i].y == y+yoffset) overlap = true;
    }*/
    if (!overlap) {
      cells[cellnum++] = new Cell(this.id, this.x+xoffset, this.y+yoffset, this.vel, newSize, this.newR, this.newG, this.newB, newChance, newmutChance, this.mutIntensity, this.deathtime);
    }
  }

  tick() {
    if(this.deathtime < this.lifetime){
      return;
    }
    
    this.x += random(-this.vel, this.vel);
    this.y += random(-this.vel, this.vel);

    if (random(1) < this.chance) {
      this.mitosis();
    }
    constrain(this.x, 0, width);
    constrain(this.y, 0, height);
    
    this.lifetime++;
  }

  draw() {
    if(this.deathtime < this.lifetime){
      return;
    }
    noStroke();
    fill(this.r, this.g, this.b, 150);
    circle(this.x, this.y, this.size);
    stroke(this.r, this.g, this.b, 200);
    fill(this.r, this.g, this.b, 200);
    circle(this.x, this.y, this.size/4);
  }
}

let cells = [];

let cellnum = 0;

function setup() {
  createCanvas(640, 480);
  
  spawnCells(1, 30, 50, 255, 50, 5, 0.004, 0.003, 10, 60*10, 5000);
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

function spawnCells(num, size, r, g, b, vel, chance, mutChance, mutIntensity, deathtime, offset) {
  cellnum = num;
  for (let i = 0; i < num; i++) {
    cells[i] = new Cell(i, width/2, height/2, vel, size, r, g, b, chance, mutChance, mutIntensity, deathtime);
  }
}


