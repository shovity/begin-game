document.addEventListener('DOMContentLoaded', () => {

  /**
   * Initalize varible
   */
  var mx = 200;
  var my = 200;
  var wW = window.innerWidth;
  var socket = io('/plane');

  var framePerSeconds = 60;
  var fireBackStep = 15; // pixel
  var framePerReact = framePerSeconds / 6;

  var bulletSpeed = 500 / framePerSeconds;
  var fireBackSpeed = 70 / framePerSeconds;
  var rotateSpeed = 60 / framePerSeconds;

  var loopFrame = 0;

  var oY = 0;

  /**
   * Top Bar
   */
  var topBar = {
    numOl: document.getElementById('num-ol'),
    numFps: document.getElementById('num-fps')
  }



  // Canvas
  var canvas = {
    canvas: document.getElementById('canvas'),
    ctx: this.canvas.getContext('2d')
  }

  /**
   * Match box
   */
  var matchBox = {
    matchBox: document.getElementById('match-box'),
    btnStart: document.getElementById('start-match'),
    megMatch: document.getElementById('meg-match'),
    cursor: document.getElementsByClassName('cursor'),

    isMatching: false,

    show() {
      this.matchBox.className = '';
    },

    hidden() {
      this.matchBox.className = 'hidden';
    },

    startProgress() {
      this.cursor[0].className = 'cursor active';
      this.cursor[1].className = 'cursor active';
      this.cursor[2].className = 'cursor active';
    },

    stopProgress() {
      this.cursor[0].className = 'cursor';
      this.cursor[1].className = 'cursor';
      this.cursor[2].className = 'cursor';
    },

    startFindingMatch() {
      this.isMatching = true;
      this.startProgress();
      this.btnStart.innerHTML = 'Cancel';
      this.megMatch.innerHTML = 'Looking for match...';
      socket.emit('findMatch');
    },

    cancelFindingMatch() {
      this.isMatching = false;
      this.stopProgress();
      this.btnStart.innerHTML = 'Start Match';
      this.megMatch.innerHTML = 'You have been leave from queue';
      socket.emit('cancelFindMatch');
    }
  }

  // Plane
  class Plane {
    constructor(img) {
      this.d = 0;
      this.x = 100;
      this.y = 100;
      this.w = 50;
      this.h = 50;
      this.img = img;
      this.fireBack = 0;
    }

    draw(x = this.x, y = this.y, d = this.d) {
      canvas.ctx.save();

      // Fire back
      if (this.fireBack > 0) {
        this.fireBack -= fireBackSpeed;
      }

      if (Math.abs(oY - my) > 30) {
        if (my - oY > 0) {
          d += rotateSpeed;
        } else {
          d -= rotateSpeed;
        }
      } else {
        if (d > rotateSpeed) {
          d -= rotateSpeed;
        } else if (d < -rotateSpeed) {
          d += rotateSpeed;
        }
      }

      canvas.ctx.translate(x - this.fireBack, y);
      canvas.ctx.rotate(d * Math.PI / 180);
      canvas.ctx.drawImage(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
      canvas.ctx.restore();
    }
  }



  var plane1 = new Plane(document.getElementById('plane-1'));
  var plane2 = new Plane(document.getElementById('plane-2'));

  var bullet = {
    bs: [],

    addBullet(x, y) {
      this.bs.push({
        x,
        y
      });
    },

    draw() {
      var l = this.bs.length;
      var i = 0;
      canvas.ctx.save();
      canvas.ctx.fillStyle = '#ff0000';

      this.bs.forEach(function(v, i, o) {
        canvas.ctx.fillRect(v.x, v.y, 15, 2);
        v.x += bulletSpeed;
        // Remove bullet when it out of screen
        if (v.x > wW) o.splice(i, 1);
      });

      canvas.ctx.restore();
    }
  }


  var renderInterval = setInterval(renderScreen, 1000 / framePerSeconds);


  function renderScreen() {
    // Clear screen
    canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    // Draw
    plane1.draw(mx, my);
    plane2.draw();

    bullet.draw();


    // On react
    if (loopFrame == 0) onReact();

    if (++loopFrame > framePerReact) loopFrame = 0;

    socket.emit('update plane', {
      x: mx,
      y: my
    });
  }

  function onReact() {
    oY = my;
    // socket.emit('update plane', {x: mx, y: my});
  }

  function beginMatch() {
    matchBox.hidden();
    matchBox.isMatching = false;
    matchBox.stopProgress();
    matchBox.btnStart.innerHTML = 'Start match';
  }

  var updateMousePosisionInterval = document.addEventListener('mousemove', function(event) {
    mx = event.pageX;
    my = event.pageY;
  });

  //////////////////////////

  // Event Fire
  document.addEventListener('click', function(event) {
    socket.emit('fire', {
      x: mx,
      y: my
    });
    plane1.fireBack = fireBackStep;
    bullet.addBullet(event.pageX + 20, event.pageY);
  });

  matchBox.btnStart.addEventListener('click', () => {
    if (matchBox.isMatching) matchBox.cancelFindingMatch();
    else matchBox.startFindingMatch();
  });


  topBar.numFps.innerHTML = framePerSeconds + 'fps';

  canvas.canvas.width = window.innerWidth;
  canvas.canvas.height = window.innerHeight;

  socket.on('update data', function(data) {
    topBar.numOl.innerHTML = data.users.length + ' online';
  });

  socket.on('update plane', function(data) {
    plane2.x = data.x;
    plane2.y = data.y;
  });

  socket.on('fire', function(data) {
    bullet.addBullet(data.x + 20, data.y);
  });

  socket.on('start match', function(data) {
    matchBox.megMatch.innerHTML = 'Get ready, your match is beginning';
    setTimeout(beginMatch, 1000);
  });
});
