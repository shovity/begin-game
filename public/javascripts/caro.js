document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initalize varibles
     */
    var socket = io('/games/caro');
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    var caroW = 0; // Cu thich tang co, deu thich chia day
    var caroH = 0;
    var caroMatrix = []; // Caro Matrix
    var team = 'x';
    var drawGridReady = false;
    var myTurn = false;

    // Top bar
    var numOl = document.getElementById('num-ol');
    var numFi = document.getElementById('num-fi');

    document.getElementById('canvas').width = wWidth * 2 / 3;
    document.getElementById('canvas').height = wHeight * 2 / 3;

    /**
     * Begin Match
     */
    function beginMatch() {
        // Canvas
        var canvas = document.getElementById('canvas');
        var showIndex = false;
        var ctx = canvas.getContext('2d');

        // Line color
        var grad = ctx.createLinearGradient(100, 150, 280, 280);
        grad.addColorStop(0, "#D2065A");
        grad.addColorStop(1, "#2897A2");
        // Fix size canvs
        canvas.width = wWidth * 2 / 3;
        canvas.height = wHeight * 2 / 3;

        matchBox.hidden();
        matchBox.isMatching = false;
        matchBox.stopProgress();
        matchBox.btnStart.innerHTML = 'Start match';

        if (team == 'o') myTurn = true;
        drawGrid();

        // Initizile array for caro matrix
        function inintCaroMatrix() {
            for (let x = -5; x < caroW + 6; x++) {
                caroMatrix[x] = [];
                for (let y = -5; y < caroH + 6; y++) caroMatrix[x][y] = 'e';
            }
            // console.log(caroMatrix)
        }

        // Draw grid to canvas
        function drawGrid() {
            var delay = 20; // ms
            var iterator = genDrawGrid();
            var interval = setInterval(() => {
                if (iterator.next().done) clearInterval(interval);
            }, delay);
        }

        // Generator to draw line
        function* genDrawGrid() {
            ctx.strokeStyle = grad;
            ctx.fillStyle = grad;
            ctx.lineWidth = 1;
            if (showIndex) ctx.fillText('0', 0, 15);

            // draw rows
            for (let i = 30.5; i < canvas.height - 15; i += 30) {
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
                if (showIndex) ctx.fillText((i - 0.5) / 30, 0, i + 15);
                caroH++;
                yield;
            }

            // draw cols
            for (let i = 30.5; i < canvas.width - 15; i += 30) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
                if (showIndex) ctx.fillText((i - 0.5) / 30, i + 3, 15);
                caroW++;
                yield;
            }

            drawGridReady = true;
            inintCaroMatrix();
        }

        /**
         * Hit to square
         * @param  {string} team  X or O
         * @param  {int} x        posision horizontal
         * @param  {int} y        posision vertical
         */
        function hit(team, x, y) {
            // console.log(caroMatrix[x][y])
            if (x <= caroW && y <= caroH && caroMatrix[x][y] == 'e' && drawGridReady) {
                ctx.strokeStyle = grad;
                if (team == 'o') {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.arc(30 * x + 15, 30 * y + 15, 7, 0, Math.PI * 2);
                    ctx.stroke();
                    caroMatrix[x][y] = team;
                } else if (team == 'x') {
                    ctx.fillStyle = grad;
                    ctx.font = "25px Arial";
                    ctx.fillText('x', 30 * x + 10, 30 * y + 22);
                    caroMatrix[x][y] = team;
                } else {
                    console.log('param: team must is \'o\' or \'x\'');
                }

                // Check win
                var result = checkWin(x, y, team);
                if (result) {
                    endMatch(...result);
                }
            }
        }

        /**
         * @param  {int} Position x
         * @param  {int} Position y
         * @param  {string} Team
         * @return {boolean} is win
         */
        function checkWin(x, y, team) {

            // Horizontal |
            var xl = x;
            while (caroMatrix[xl - 1][y] == team) xl--;
            var xr = xl;
            while (caroMatrix[xr][y] == team) xr++;
            if (xr - xl > 4) return [xl, y, xr - 1, y];

            // Vertical --
            var yt = y;
            while (caroMatrix[x][yt - 1] == team) yt--;
            var yb = yt;
            while (caroMatrix[x][yb] == team) yb++;
            if (yb - yt > 4) return [x, yt, x, yb - 1];

            // Reverse Solidus \
            var xl = x;
            var yt = y;
            while (caroMatrix[xl - 1][yt - 1] == team) {
                xl--;
                yt--;
            }
            var xr = xl;
            var yb = yt;
            while (caroMatrix[xr][yb] == team) {
                xr++;
                yb++;
            }
            if (xr - xl > 4) return [xl, yt, xr - 1, yb - 1];

            // Solidus /
            var xl = x;
            var yb = y;
            while (caroMatrix[xl - 1][yb + 1] == team) {
                xl--;
                yb++;
            }
            var xr = xl;
            var yt = yb;
            while (caroMatrix[xr][yt] == team) {
                xr++;
                yt--;
            }
            if (xr - xl > 4) return [xl, yb, xr - 1, yt + 1];

            // When not win
            return false;
        }

        // End of the match
        function endMatch(x1, y1, x2, y2) {
            ctx.strokeStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(x1 * 30 + 15.5, y1 * 30 + 15.5);
            ctx.lineTo(x2 * 30 + 15.5, y2 * 30 + 15.5);
            ctx.stroke();

            megPop.popup("Match End! Press OK to go Home", function () {
                matchBox.megMatch.innerHTML = 'Start Finding Match';
                matchBox.show();
            });

            myTurn = false;
            socket.emit('iwin');
        }

        // Click canvas event
        canvas.addEventListener('click', (event) => {
            if (!myTurn) return;

            // console.log(`caroH = ${caroH}; caraW = ${caroW}`)
            var x = Math.floor(((event.pageX - wWidth * 0.16) - 0.5) / 30);
            var y = Math.floor(((event.pageY - wHeight * 0.16) - 0.5) / 30);
            // console.log(`x = ${x}, y = ${y}`)
            socket.emit('hit', { x, y });
            hit(team, x, y);
            myTurn = false;
        });

        // Socket event
        socket.on('hit', (data) => {
            myTurn = true;
            hit(data.team, data.x, data.y);
        });

        socket.on('enemy outed', function() {
            myTurn = false;
            matchBox.megMatch.innerHTML = 'Your enemy is run away';
            matchBox.show();
        });

        // End beginMatch function
    }

    /**
     * Crazy Duck
     */
    {
        var duck = document.getElementById('duck');
        var delay = 2000; //ms
        var x = 0;
        var y = 0;

        var interval = setInterval(function () {
            delay = Math.random() * 3500 + 2500;
            duck.style.left = x + Math.random()*300-150 + 'px';
            duck.style.top = y  + Math.random()*300-150 + 'px';
        }, delay);

        // Time out to display duck, fix display flash
        var countToStop = 0;
        var startDuckInterval = setInterval(function () {
            if (x != 0) countToStop++;
            if (countToStop > 2) {
                duck.className = '';
                clearInterval(startDuckInterval);
            }
        }, 1000);

        window.addEventListener('mousemove', function (event) {
           x = event.pageX;
           y = event.pageY;
        });

        duck.addEventListener('click', function () {
            clearInterval(interval);
            duck.setAttribute('style', '');
            duck.className = 'sleep';
        });
    }

    /**
     * Message popup
     */
    var megPop = {
        megPop: document.getElementById('al'),
        meg: document.getElementById('al-meg'),
        btn: document.getElementById('al-ok'),

        al(message, timeout = 1000) {
            this.btn.className = 'display-none';
            this.meg.innerHTML = message;
            this.megPop.className = '';
            setTimeout(function () {
                this.megPop.className = 'fade';
            }, timeout);
        },

        popup(message, callback) {
            this.btn.className = 'btn btn-small';
            this.megPop.className = '';
            this.meg.innerHTML = message;
            this.btn.addEventListener('click', () => {
                if (callback !== undefined) callback();
                megPop.megPop.className = 'fade';
            });
        }
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

    ////////////////////////////////////////////////////////////////////

    // megPop.popup('Lorem ipsum dolor sit amet');


    window.addEventListener('click', function (event) {
        if (event.keyCode == 32) {
            socket.emit('iwin');
        }
    })

    matchBox.btnStart.addEventListener('click', () => {
        if (matchBox.isMatching) matchBox.cancelFindingMatch(); else matchBox.startFindingMatch();
    });


    socket.on('start match', function(data) {
        matchBox.megMatch.innerHTML = 'Get ready, your match is beginning';
        team = data.team;
        setTimeout(beginMatch, 1000);
    });

    socket.on('update data', function(data) {
        numOl.innerHTML = data.users.length + ' online';
    });
});
