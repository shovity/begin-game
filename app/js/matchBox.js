module.exports = {
  init: () => {
    require('../css/matchBox.css')
    document.body.innerHTML += `
    <div id="match-box">
      <div id="progress">
        <div id="cursor-1" class="cursor"></div>
        <div id="cursor-2" class="cursor"></div>
        <div id="cursor-3" class="cursor"></div>
      </div>
      <p id="meg-match">Start to finding someone!</p>
      <a id="start-match" class="btn">Start Finding Match</a>
    </div>`
  }
}
