"use strict"
const SCALE = 4;
// const winw = window.innerWidth;
// const winh = window.innerHeight;
const winw = 350;
const winh = 650;
const cvs = document.createElement("canvas");
document.body.appendChild(cvs);
cvs.setAttribute("width", winw * SCALE);
cvs.setAttribute("height", winh * SCALE);
cvs.style.width = `${winw}px`;
cvs.style.height = `${winh}px`;
const ctx = cvs.getContext("2d");

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, winw, winh);

const PI = Math.PI;

const color = (r = false, g = false, b = false, a = false) => {
 if (a || a === 0) {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  } else if (b || b === 0) {
    ctx.fillStyle = `rgba(${r}, ${g}, ${0}, ${b})`;
    return `rgba(${r}, ${g}, ${0}, ${b})`;
  } else if (g || g === 0) {
    ctx.fillStyle = `rgba(${r}, ${0}, ${0}, ${g})`;
    return `rgba(${r}, ${0}, ${0}, ${g})`;
  } else if (r || r === 0) {
    ctx.fillStyle = `rgba(${255}, ${255}, ${255}, ${r})`;
    return `rgba(${255}, ${255}, ${255}, ${r})`;
  } else {
    ctx.fillStyle = `rgba(${255}, ${255}, ${255}, ${1})`;
    return `rgba(${255}, ${255}, ${255}, ${1})`;
  }
}

const stroke = (r = false, g = false, b = false, a = false) => {
  if (a || a === 0) {
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  } else if (b || b === 0) {
    ctx.strokeStyle = `rgba(${r}, ${g}, ${0}, ${b})`;
    return `rgba(${r}, ${g}, ${0}, ${b})`;
  } else if (g || g === 0) {
    ctx.strokeStyle = `rgba(${r}, ${0}, ${0}, ${g})`;
    return `rgba(${r}, ${0}, ${0}, ${g})`;
  } else if (r || r === 0) {
    ctx.strokeStyle = `rgba(${255}, ${255}, ${255}, ${r})`;
    return `rgba(${255}, ${255}, ${255}, ${r})`;
  } else {
    ctx.strokeStyle = `rgba(${255}, ${255}, ${255}, ${1})`;
    return `rgba(${255}, ${255}, ${255}, ${1})`;
  }
}

const clrScr = () => {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
}
const clearRect = () => {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
}
const fill = (c = 0) => {
  color(c, 0, 0, 1);
  ctx.fillRect(0, 0, cvs.width, cvs.height);
}
const translate = (x, y) => {
  ctx.translate(x, y);
}
const transform = (ox, nx, oy, ny) => {
  ctx.transform(ox, nx, oy, ny);
}
const font = (font) => {
  ctx.font = font;
}
const text = (text, x, y, w) => {
  ctx.fillText(text, x, y, w);
}
const save = () => {
  ctx.save();
}
const restore = () => {
  ctx.restore();
}
const line = (sx, sy, ex, ey, w = 1, round = false) => {
  ctx.beginPath();
  ctx.lineWidth = w;
  if (round) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.closePath();
}
const curve = (sx, sy, ex, ey, width = 1, radius = 20, fill = false) => {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(sx, sy);
  const midx = sx + (ex - sx) / 2;
  const midy = sy + (ey - sy) / 2;
  ctx.quadraticCurveTo(midx, midy - radius, ex, ey);
  ctx.stroke();
  if (fill) {
    ctx.fill();
  }
}

const rect = (x, y, w, h, fill = true, outline = false, lineWidth = 1) => {
  ctx.beginPath(); 
  ctx.rect(x, y, w, h);
  if (fill) {
    ctx.fill();
  }
  if (outline) {
    ctx.stroke();
    ctx.lineWidth = lineWidth;
  }
  ctx.closePath();
}

const fillRect = (x, y, w, h) => {
  ctx.fillRect(x, y, w, h);
}
const arc = (x, y, r, fill = true, outline = false, lineWidth = 1) => {
  ctx.beginPath();
  const nr = outline ? r - outline : r;
  ctx.arc(x, y, nr, 0, PI * 2, false);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (outline) {
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.closePath();
}


const _$ = (givMe) => {
  const self = document.querySelectorAll(givMe);
  self.T = (text) => {
    self.forEach((all) => {
      all.innerText = text;
    });
  };
  self.O = (event, fun) => {
    self.forEach((all) => {
      all.addEventListener(event, fun);
    });
  };
  self.S = (object) => {
    const css = Object.entries(object);
    self.forEach((all) => {
      css.forEach(([prorerty, value]) => {
        all.style[prorerty] = value;
      });
    });
  };
  return self;
};

// return Id
const ID = (id) => {
  const self = document.getElementById(id);
  self.on = (event, fun) => {
    self.addEventListener(event, fun);
  };
  return self;
};

// class add in html
function addClass(array, className = "active") {
  if (array.length == undefined) {
    array.classList.forEach(() => array.classList.add(className));
  } else {
    array.forEach((element) => element.classList.add(className));
  }
}

// claass remove in html
function removeClass(array, className = "active") {
  if (array.length == undefined) {
    array.classList.forEach(() => array.classList.remove(className));
  } else {
    array.forEach((element) => element.classList.remove(className));
  }
}

// always positive
function sr(val) {
  return Math.sqrt(Math.pow(val, 2));
}

// degree convert to radian
function toRadian(degree) {
  return (degree * Math.PI) / 180;
}

// radian convert to Degree
function toDegree(radian) {
  return (radian * 180) / Math.PI;
}

const random = (start = 0, end = 1) => {
  return start + (Math.random() * (end - start));
}

const map = (point, start, end, min, max) => {
  const per = (point - start) / (end - start);
  return ((max - min) * per) + min;
}

const ran = (v, max) => {
  return (v + Math.random() * max);
}