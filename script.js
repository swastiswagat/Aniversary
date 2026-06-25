const scenes = {
  intro: document.getElementById("intro"),
  gate: document.getElementById("gate"),
  quiz: document.getElementById("quiz"),
  riddle: document.getElementById("riddle"),
  quotes: document.getElementById("quotes"),
  surprise: document.getElementById("surprise"),
  final: document.getElementById("final"),
};

const successPopup = document.getElementById("successPopup");
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const finalMusic = document.getElementById("finalMusic");

let chainCount = 1;

/* ---------- HELPERS ---------- */
function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", playClick);
});

function showScene(sceneName) {
  Object.values(scenes).forEach(scene => {
    scene.classList.remove("active");
    scene.classList.add("hidden");
  });

  scenes[sceneName].classList.remove("hidden");
  scenes[sceneName].classList.add("active");
}

function showSuccess() {
  successPopup.classList.remove("hidden");
  successPopup.classList.add("correct-anim");

  const chain = document.querySelector(`.chain${chainCount}`);
  if (chain) {
    chain.classList.add("chain-break");
    chainCount++;
  }

  setTimeout(() => {
    successPopup.classList.add("hidden");
    successPopup.classList.remove("correct-anim");
  }, 1000);
}

function showError() {
  document.querySelector(".card").classList.add("shake");

  setTimeout(() => {
    document.querySelector(".card").classList.remove("shake");
  }, 400);
}

function fadeOutMusic(audio, callback) {
  let fade = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      clearInterval(fade);
      audio.pause();
      audio.volume = 1;
      if (callback) callback();
    }
  }, 150);
}

/* ---------- TYPEWRITER ---------- */
const typewriter = document.getElementById("typewriter");
const introText = "I made something special only for you...";
let introIndex = 0;

function typeEffect() {
  if (introIndex < introText.length) {
    typewriter.innerHTML += introText.charAt(introIndex);
    introIndex++;
    setTimeout(typeEffect, 60);
  }
}
typeEffect();

/* ---------- QUESTIONS ---------- */
const questions = [
  {
    q: "What nickname do I call you?",
    word: "CAPY",
    reveal: [0, 2]
  },
  {
    q: "What date changed our story forever?",
    word: "2606",
    reveal: [0, 1, 3]
  },
  {
    q: "What speaks to my heart?",
    word: "LOVE",
    reveal: [0, 2]
  }
];

let currentQuestion = 0;

/* ---------- RIDDLES ---------- */
const riddles = [
  {
    q: "I am not a word, yet I speak to your heart. What am I?",
    word: "LOVE",
    reveal: [0, 2]
  },
  {
    q: "What comes once in a minute and twice in a moment?",
    word: "M",
    reveal: []
  },
  {
    q: "What becomes stronger with every challenge?",
    word: "LOVE",
    reveal: [1, 3]
  }
];

let currentRiddle = 0;

/* ---------- QUOTES ---------- */
const quotes = [
  "In every universe, I would still choose you ❤️",
  "You are my favorite hello ❤️",
  "Every love story is beautiful, but ours is my favorite ❤️",
  "You are my home ❤️",
  "Happy Anniversary Deepuu ❤️"
];

let currentQuote = 0;

/* ---------- BOXES ---------- */
function renderBoxes(word, reveal, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  for (let i = 0; i < word.length; i++) {
    if (reveal.includes(i)) {
      const box = document.createElement("div");
      box.className = "letter-box";
      box.textContent = word[i];
      container.appendChild(box);
    } else {
      const box = document.createElement("div");
      box.className = "missing-box";

      const input = document.createElement("input");
      input.maxLength = 1;
      input.dataset.index = i;

      box.appendChild(input);
      container.appendChild(box);
    }
  }
}

/* ---------- QUIZ ---------- */
function loadQuestion() {
  const current = questions[currentQuestion];
  document.getElementById("questionText").innerText = current.q;
  renderBoxes(current.word, current.reveal, "answerBoxes");
}

document.getElementById("submitAnswer").addEventListener("click", () => {
  const current = questions[currentQuestion];
  let finalWord = "";

  const inputs = document.querySelectorAll("#answerBoxes input");
  let inputMap = {};

  inputs.forEach(input => {
    inputMap[input.dataset.index] = input.value.toUpperCase();
  });

  for (let i = 0; i < current.word.length; i++) {
    if (current.reveal.includes(i)) {
      finalWord += current.word[i];
    } else {
      finalWord += inputMap[i] || "";
    }
  }

  if (finalWord === current.word) {
    showSuccess();
    currentQuestion++;

    setTimeout(() => {
      if (currentQuestion < questions.length) {
        loadQuestion();
      } else {
        showScene("riddle");
        loadRiddle();
      }
    }, 1200);
  } else {
    showError();
  }
});

/* ---------- RIDDLE ---------- */
function loadRiddle() {
  const current = riddles[currentRiddle];
  document.getElementById("riddleText").innerText = current.q;
  renderBoxes(current.word, current.reveal, "riddleBoxes");
}

document.getElementById("submitRiddle").addEventListener("click", () => {
  const current = riddles[currentRiddle];
  let finalWord = "";

  const inputs = document.querySelectorAll("#riddleBoxes input");
  let inputMap = {};

  inputs.forEach(input => {
    inputMap[input.dataset.index] = input.value.toUpperCase();
  });

  for (let i = 0; i < current.word.length; i++) {
    if (current.reveal.includes(i)) {
      finalWord += current.word[i];
    } else {
      finalWord += inputMap[i] || "";
    }
  }

  if (finalWord === current.word) {
    showSuccess();
    currentRiddle++;

    setTimeout(() => {
      if (currentRiddle < riddles.length) {
        loadRiddle();
      } else {
        showScene("quotes");
        loadQuote();
      }
    }, 1200);
  } else {
    showError();
  }
});

/* ---------- QUOTES ---------- */
function loadQuote() {
  document.getElementById("quoteText").innerText = quotes[currentQuote];
}

document.getElementById("nextQuote").addEventListener("click", () => {
  currentQuote++;

  if (currentQuote < quotes.length) {
    loadQuote();
  } else {
    showScene("surprise");
  }
});

/* ---------- BUTTON EVENTS ---------- */
document.getElementById("startBtn").addEventListener("click", () => {
  bgMusic.play();
  showScene("gate");
});

document.getElementById("startQuiz").addEventListener("click", () => {
  showScene("quiz");
  loadQuestion();
});

document.getElementById("surpriseBtn").addEventListener("click", () => {
  fadeOutMusic(bgMusic, () => {
    finalMusic.volume = 0;
    finalMusic.play();

    let fadeIn = setInterval(() => {
      if (finalMusic.volume < 0.95) {
        finalMusic.volume += 0.05;
      } else {
        clearInterval(fadeIn);
      }
    }, 150);

    showScene("final");
  });
});