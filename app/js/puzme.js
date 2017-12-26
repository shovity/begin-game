const connecter = require('./connecter')

module.exports = () => {
  connecter.connect(1, '/puzme', (socket) => {

    socket.on('data', (data) => {
      //
    })

  })


  require('../css/puzme.css')

  const matrixBox = document.getElementById('matrix-box')

  var wImage = 300,
    hImage = 500,
    numRowMatrix = 4,
    numColMatrix = 3,
    wPiece = wImage / numColMatrix,
    hPiece = hImage / numRowMatrix
    matrix = initMatrix(numRowMatrix, numColMatrix, true),
    xCell = numColMatrix * numRowMatrix - 1,
    pCell = []


  // Initalize matrix
  for (let r = 0; r < numRowMatrix; r++) {
    var tr = document.createElement('tr')
    for (let c = 0; c < numColMatrix; c++ ) {
      var td = document.createElement('td')
      td.id = r + '-' + c
      td.className = 'piece'
      td.style.backgroundSize = wImage + 'px ' + hImage + 'px'
      td.style.width = wPiece + 'px'
      td.style.height = hPiece + 'px'
      tr.appendChild(td)

      td.addEventListener('click', () => {

        var l1 = pCell[0] == r && Math.abs(c - pCell[1]) != 1,
          l2 = pCell[1] == c && Math.abs(r - pCell[0]) != 1,
          l3 = r != pCell[0] && c != pCell[1]

        if (l1 || l2 || l3) {
          // do nothing
        } else {
          [matrix[pCell[0]][pCell[1]], matrix[r][c]] = [matrix[r][c], matrix[pCell[0]][pCell[1]]]
          document.getElementById(r + '-' + c).style.marginBottom = -hPiece + 'px';

          setTimeout(() => {
            //
            render(matrix)
            document.getElementById(r + '-' + c).style.marginBottom = '';
          }, 500)

          if (pCell[0] == numRowMatrix-1 && pCell[1] == numColMatrix -1) {
            console.log(checkWin());
          }
        }

      })
    }
    matrixBox.appendChild(tr)
  }

  render(matrix)

  /**
   * Render
   * @type {[type]}
   */
  function render(matrix) {
    for (let r = 0; r < numRowMatrix; r++) {
      for (let c = 0; c < numColMatrix; c++) {
        var p = matrix[r][c]
          l = (p % numColMatrix) * wPiece,
          t = Math.floor(p / numColMatrix) * hPiece

        if (matrix[r][c] == xCell) {
          document.getElementById(r + '-' + c).className = 'piece piece-x'
          pCell = [r, c]
        } else {
          document.getElementById(r + '-' + c).className = 'piece'
          document.getElementById(r + '-' + c).style.backgroundPosition = `-${l}px -${t}px`
        }
      }
    }
  }

  /**
   * Shuffles array in place.
   * @param {Array} size items The array containing the items. Will change
   * @return {Array} result
   */
  function initMatrix(nr, nc, shuff) {
    // Initalize matrix
    var result = []
    for (let i = 0; i < nr; i++) {
      result[i] = []
      for (let j = 0; j < nc; j++) result[i][j] = i*nc + j
    }

    if (!shuff) return result

    // Shuffles
    for (let r = 0; r < nr; r++) {
      for (let c = 0; c < nc; c++) {
        let rr = Math.floor(Math.random() * nr),
          rc = Math.floor(Math.random() * nc);
        [result[r][c], result[rr][rc]] = [result[rr][rc], result[r][c]];
      }
    }

    return result
  }

  /**
   * Check win
   */
  function checkWin() {
    var win = true
    for (let i = 0; i < numRowMatrix; i++) {
      for (let j = 0; j < numColMatrix; j++) if (matrix[i][j] != i*numColMatrix + j) win = false
    }
    return win
  }

  //--
}
