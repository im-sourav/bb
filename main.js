const startButton = ID("start-box");
const homeWindow = ID("home");
const rsWindow = ID("rs-window");
const scoreGame = ID("score");
const rsButton = ID("rs-button");
const touchFild = ID("touch-fild");

const FPS = 60;
const WIDTH = winw * SCALE;
const HEIGHT = winh * SCALE;
const PAD_W = 60 * SCALE;
const PAD_H = 6 * SCALE;

class Pad {
  constructor(x, y, w, h, s) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
    this.vx = s;
    this.topR = 10;
    this.tx = this.x;
  }

  draw() {
    stroke(255, 255, 1);
    color(255, 255, 1);
    curve(this.x, this.y, this.x + this.w, this.y, 3 * SCALE, this.topR * SCALE, true);
    color();
    rect(this.x, this.y, this.w, this.h);
    color(0.02)
    rect(this.tx, this.y - 2 * SCALE, this.w, this.h + 2 * SCALE);
  }

  update() {
    if (!(this.x + this.s > this.tx && this.x - this.s < this.tx)) {
      this.x += this.vx;
    }
    this.vx = this.tx > this.x ? this.s : this.tx < this.x ? -this.s : 0;
  }
}

class Ball {
  constructor(x, y, r, speed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.px = this.x;
    this.py = this.y;
    this.speed = speed;
    this.vx = this.speed * (Math.random() * 2 - 1);
    this.vy = -this.speed;
  }

  draw() {
    color();
    stroke(255, 255, 0, 1);
    arc(this.x, this.y, this.r, true, true, 3);
  }

  update() {
    this.px = this.x;
    this.py = this.y;
    this.x += this.vx;
    this.y += this.vy;
  }
}

class Obstacle {
  constructor(x, y, w, h, color, stroke) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.stroke = stroke;
    this.boder = 2 * SCALE;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.stroke;
    rect(this.x, this.y, this.w, this.h, true, true, this.boder);
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.r = Math.random() * 15;
    this.vx = (Math.random() * 40) - 20;
    this.vy = (Math.random() * 40) - 10;
  }

  draw() {
    ctx.fillStyle = this.color;
    arc(this.x, this.y, this.r);
    this.x += this.vx;
    this.y += this.vy;
    this.r /= 1.1;
  }
}

class AddBallPower {
  constructor(x, y, w, text, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.type = type;
    this.size = 15 * SCALE;
    this.vy = 15;
    this.text = text;
  }

  draw() {
    font(`${this.size}px Arial`)
    text(this.text, (this.x + this.w / 2) - this.size / 2, (this.y + this.w / 2) - this.size / 2)
    this.y += this.vy;
  }
}

let balls = [];
let obstacles = [];
let blocks = [];
let particles = [];
let powers = [];
let pad;
let score = 0;
let life = 3;
let pad_speed, ball_speed, ball_size, power_ret;
let run = true;
let level = 0;
let isGT = []; // is game test show


const showGameText = () => {
  color();
  font(`${isGT[1] * SCALE}px bold Arial, sans-serif`)
  text(isGT[0], (WIDTH / 2) - isGT[2] * SCALE, HEIGHT / 2);
}

const pushTextInSGT = (text, time, font, width) => {
  isGT = [text, font, width];
  setTimeout(() => {
    isGT = false;
  }, time);
}

const gameOverWindow = () => {
  run = false;
  pushTextInSGT(`Game Over !!!`, 1000, 30, 100);
  showGameText();
  setTimeout(() => {
    rsWindow.classList.toggle("active", true);
    scoreGame.innerText = score;
  }, 2000)
}

rsButton.on("click", () => {
  rsWindow.classList.toggle("active", false);
  run = true;
  score = 0;
  life = 3;
  level = 0;
  loop();
  setup();
})

const gameCompleteWindow = () => {
  run = false;
  pushTextInSGT(`Level Complete`, 1000, 30, 100);
  showGameText();
  setTimeout(() => {
    rsWindow.classList.toggle("active", true);
    scoreGame.innerText = score;
  }, 2000)
}

const createObstacles = () => {
  obstacles = [];
  blocks = [];

  const gameMap = gameMaps[level];
  let sclX = winw / gameMaps[level].sizeX * SCALE;
  let sclY = winh / gameMaps[level].sizeY * SCALE;
  let w = sclX / 100 * gameMap.width;
  let h = sclY / 100 * gameMap.height;

  for (let row = 0; row < gameMap.map.length; row++) {
    for (let col = 0; col < gameMap.map[row].length; col++) {
      const gm = gameMap.map[row][col];

      if (gm.type == "_") {
        obstacles.push(new Obstacle(
          col * sclX + (sclX - w) / 2,
          row * sclY + (sclY - h) / 2,
          w, h, gm.color, gm.stroke))
      } else if (gm.type == "$") {
        blocks.push(new Obstacle(col * sclX, row * sclY, sclX, sclY, gm.color, gm.stroke))
      }
    }
  }
}

const drawObstacles = () => {
  obstacles.forEach((obs) => {
    obs.draw();
  })
  blocks.forEach((obs) => {
    obs.draw();
  })
}

const collisionXorY = (cx, cy, cr, rx, ry, rw, rh) => {
  const left = Math.abs(rx - (cx + cr));
  const right = Math.abs((cx - cr) - (rx + rw));
  const top = Math.abs(ry - (cy + cr));
  const bottom = Math.abs((cy - cr) - (ry + rh));
  const ary = [left, right, top, bottom];
  ary.sort((a, b) => a - b);
  if (ary[0] === left || ary[0] === right) {
    return "x";
  }
  return "y";
}

const obstacleCollision = () => {
  const o = obstacles;
  balls.forEach((b) => {
    for (let i = 0; i < o.length; i++) {
      if (o[i].x <= b.x + b.r && o[i].x + o[i].w >= b.x - b.r && o[i].y <= b.y + b.r && o[i].y + o[i].h >= b.y - b.r) {

        let side = collisionXorY(b.px, b.py, b.r, o[i].x, o[i].y, o[i].w, o[i].h);
        if (side == "x") {
          b.x = b.px;
          b.vx = - b.vx;
        } else {
          b.vy = - b.vy;
          b.y = b.py;
        }
        let len = Math.floor(Math.random() * 10 + 10);
        for (let j = 0; j < len; j++) {
          particles.push(new Particle(ran(o[i].x, o[i].w), ran(o[i].y, o[i].h), o[i].color));
        }

        if (Math.random() > power_ret) {
          const prs = [["💖", "life"], ["💊", "ball"], ["💊", "ball"], ["🧭", "slow"], ["🧭", "slow"]];
          const one = prs[Math.floor(Math.random() * prs.length)];
          powers.push(new AddBallPower(o[i].x, o[i].y, o[i].w, one[0], one[1]));
        }
        score += 5;
        obstacles.splice(i, 1);
        Sounds.destroy();

        if (o.length === 0) {
          balls = [];
          Sounds.win();
          level++;
          if (gameMaps.length > level) {
            setTimeout(() => {
              setup();
            }, 2000);
          } else {
            gameCompleteWindow();
          }
          return;
        }
        return;
      }
    }

    // blocks collision
    blocks.forEach((B) => {
      if (B.x <= b.x + b.r && B.x + B.w >= b.x - b.r && B.y <= b.y + b.r && B.y + B.h >= b.y - b.r) {
        let side = collisionXorY(b.px, b.py, b.r, B.x, B.y, B.w, B.h);
        if (side == "x") {
          b.x = b.px;
          b.vx = - b.vx;
        } else {
          b.vy = - b.vy;
          b.y = b.py;
        }
        Sounds.hitWall();
      }
    });
  })
}

const boundaryCollision = () => {
  balls.forEach((b, i) => {
    if (b.x - b.r < 0 || b.x + b.r > WIDTH) {
      b.x = b.px;
      b.vx = - b.vx;
      Sounds.hitWall();
    }
    if (b.y - b.r < 0) {
      b.y = b.py;
      b.vy = - b.vy;
      Sounds.hitWall();
    }
    if (b.y - b.r > HEIGHT) {
      balls.splice(i, 1);
      if (!balls.length) {
        Sounds.gameOverAudio();
        life--;
        if (life < 0) {
          gameOverWindow();
          return;
        }
        setTimeout(() => {
          balls.push(new Ball(pad.x + PAD_W / 2, pad.y - PAD_H * 2, ball_size, ball_speed));
        }, 500);
      } else {
        Sounds.death();
      }
    };
  })
}

const padCollision = () => {
  balls.forEach((b) => {
    if (b.x + b.r >= pad.x && b.x - b.r <= pad.x + pad.w && b.y + b.r >= pad.y && b.y - b.r <= pad.y + pad.h) {
      let side = collisionXorY(b.px, b.py, b.r, pad.x, pad.y, pad.w, pad.h);
      if (side == "y") {
        let collisionPoint = b.x - (pad.x + pad.w / 2);
        let angle = collisionPoint / (pad.w / 2);
        angle = angle * PI / 3;
        b.x = b.px;
        b.y = b.py;
        b.vx = b.speed * Math.sin(angle);
        b.vy = -b.speed * Math.cos(angle);
        pad.topR = 0;
        setTimeout(() => {
          pad.topR = 10;
        }, 1000 / (FPS / 4));
      } else {
        b.x = b.px;
        b.vx = - b.vx;
      }
      Sounds.padHit();
    }
  })
}

const draw = () => {
  clrScr();
  fill();
  pad.draw();
  pad.draw();
  pad.update();
  balls.forEach((ball) => {
    ball.update();
    ball.draw();
  });
  drawParticle();
  drawObstacles();
  drawPowers();
  drawScoreAndLife();
  if (isGT) {
    showGameText();
  }
}

const deleteParticle = () => {
  for (let i = 0; i < particles.length; i++) {
    if (particles[i].r <= 0.5) {
      particles.splice(i, 1);
      deleteParticle();
      break;
    }
  }
}

const drawParticle = () => {
  deleteParticle();
  particles.forEach((e, i) => {
    e.draw();
  })
}

const drawPowers = () => {
  powers.forEach((e, i) => {
    e.draw();
  })
}

const drawScoreAndLife = () => {
  font(`${25 * SCALE}px Arial`);
  color();
  text(`${life}💖`, WIDTH / 1.20, HEIGHT / 1.02);
  text(`🎖${score}`, WIDTH / 70, HEIGHT / 1.02);
}

const powersCollision = () => {
  for (let i = 0; i < powers.length; i++) {
    const p = powers[i];
    if (p.x + p.size > pad.x && p.x < pad.x + pad.w && p.y + p.size > pad.y && p.y < pad.y + pad.h) {
      score += 15;
      Sounds.point();
      powers.splice(i, 1);
      for (let j = 0; j < 30; j++) {
        particles.push(new Particle(p.x + p.w / 2, p.y, "#0ff"));
      }
      if (p.type === "ball") {
        balls.push(new Ball(pad.x + PAD_W / 2, pad.y - PAD_H * 2, ball_size, ball_speed));
      } else if (p.type === "life") {
        life++;
      } else {
        if (ball_speed >= 5 * SCALE) {
          balls.forEach((e) => {
            e.speed -= 0.5 * SCALE;
          })
          ball_speed -= 0.5 * SCALE;
        }
      }
      return;
    }
  }

  // whern the powers outside the boundary then remove the element
  for (let i = 0; i < powers.length; i++) {
    if (powers[i].y - powers[i].w > HEIGHT) {
      powers.splice(i, 1);
      return;
    }
  }
}

const setup = () => {
  balls = [];
  powers = []
  pushTextInSGT(`Level ${level + 1}`, 1000, 30, 40);
  pad_speed = gameMaps[level].padSpeed * SCALE;
  ball_speed = gameMaps[level].ballSpeed * SCALE;
  ball_size = gameMaps[level].ballSize * SCALE;
  power_ret = gameMaps[level].powerRet;
  pad = new Pad(WIDTH / 2 - PAD_W / 2, HEIGHT / 1.1, PAD_W, PAD_H, pad_speed);
  setTimeout(() => {
    balls.push(new Ball(pad.x + PAD_W / 2, pad.y - PAD_H * 2, ball_size, ball_speed));
  }, 1000)
  obstacles = [];
  createObstacles();
}

function animation() {
  draw();
  powersCollision();
  boundaryCollision();
  padCollision();
  obstacleCollision();
  color()

};


const move = (x) => {
  if (x <= WIDTH - PAD_W && x >= 0) {
    pad.tx = x;
    padCollision();
  }
}

touchFild.addEventListener("touchmove", (e) => move(e.touches[0].clientX * 6));
touchFild.addEventListener("mousemove", (e) => move(e.offsetX * 4));


function loop() {
  if (run) {
    animation();
    setTimeout(loop, 1000 / FPS)
  }
}

startButton.on("click", () => {
  homeWindow.classList.toggle("active", false);
  setup();
  loop();
})