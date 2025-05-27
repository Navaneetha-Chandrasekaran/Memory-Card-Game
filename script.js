const emojis = ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐸'];
let flippedCards = [];
let matchedCount = 0;
let time = 0;
let timerInterval;
let gameStarted = false;
let gamePaused = false;

// Shuffle the cards
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start the timer
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").textContent = time;
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Flip card function
function flipCard(card) {
  if (!gameStarted || gamePaused || card.classList.contains('flipped') || flippedCards.length === 2) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.emoji === second.dataset.emoji) {
      matchedCount++;
      flippedCards = [];

      if (matchedCount === emojis.length) {
        stopTimer();
        setTimeout(() => {
          document.getElementById('winMessage').innerHTML = `🎉 You Win in <strong>${time}</strong> seconds!`;
          document.getElementById('winMessage').style.display = 'block';
          endGame();
        }, 500);
      }
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        flippedCards = [];
      }, 800);
    }
  }
}

// Create the game board
function createBoard() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";
  const shuffled = shuffle([...emojis, ...emojis]);
  shuffled.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${emoji}</div>
      </div>`;

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

// Start / Pause / Resume Game
function toggleGame() {
  const btn = document.getElementById("startBtn");
  const gameBoard = document.getElementById("gameBoard");

  if (!gameStarted) {
    // Start new game
    gameStarted = true;
    gamePaused = false;
    matchedCount = 0;
    flippedCards = [];
    time = 0;
    document.getElementById("timer").textContent = time;
    document.getElementById("winMessage").style.display = "none";

    createBoard();
    gameBoard.style.pointerEvents = "auto";
    startTimer();
    btn.textContent = "⏸️ Pause Game";

  } else if (!gamePaused) {
    // Pause
    gamePaused = true;
    stopTimer();
    gameBoard.style.pointerEvents = "none";
    btn.textContent = "▶️ Resume Game";

  } else {
    // Resume
    gamePaused = false;
    startTimer();
    gameBoard.style.pointerEvents = "auto";
    btn.textContent = "⏸️ Pause Game";
  }
}

// Restart the game
function restartGame() {
  stopTimer();
  gameStarted = false;
  gamePaused = false;
  matchedCount = 0;
  flippedCards = [];
  time = 0;

  document.getElementById("timer").textContent = time;
  document.getElementById("gameBoard").innerHTML = "";
  document.getElementById("gameBoard").style.pointerEvents = "none";
  document.getElementById("startBtn").textContent = "▶️ Start Game";
  document.getElementById("winMessage").style.display = "none";
}

// End the game when all matched
function endGame() {
  gameStarted = false;
  gamePaused = false;
  document.getElementById("startBtn").textContent = "▶️ Start Game";
  document.getElementById("gameBoard").style.pointerEvents = "none";
}

// Initialize on load
window.onload = () => {
  document.getElementById("startBtn").addEventListener("click", toggleGame);
  document.getElementById("gameBoard").style.pointerEvents = "none";
  document.getElementById("winMessage").style.display = "none";
};
