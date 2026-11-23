const startButton = document.querySelector("[data-start]");
const welcomeScreen = document.querySelector('[data-screen="welcome"]');
const letterScreen = document.querySelector('[data-screen="letter"]');
const musicScreen = document.querySelector('[data-screen="music"]');
const hangmanIntroScreen = document.querySelector('[data-screen="hangman-intro"]');
const hangmanGameScreen = document.querySelector('[data-screen="hangman-game"]');
const videoIntroScreen = document.querySelector('[data-screen="video-intro"]');
const videoScreen = document.querySelector('[data-screen="video"]');
const envelope = document.querySelector("[data-envelope]");
const censorToggle = document.querySelector("[data-censor-toggle]");
const nextSurpriseButton = document.querySelector("[data-next-surprise]");
const welcomeStatus = document.querySelector("[data-status]");
const letterStatus = document.querySelector("[data-letter-status]");
const musicPlayer = document.querySelector("[data-music-player]");
const musicAudio = document.querySelector("[data-music-audio]");
const audioPlayButton = document.querySelector("[data-audio-play]");
const playIcon = document.querySelector("[data-play-icon]");
const audioProgress = document.querySelector("[data-audio-progress]");
const audioCurrentTime = document.querySelector("[data-audio-current]");
const audioDuration = document.querySelector("[data-audio-duration]");
const audioVolume = document.querySelector("[data-audio-volume]");
const audioError = document.querySelector("[data-audio-error]");
const musicNextSurpriseButton = document.querySelector("[data-music-next-surprise]");
const hangmanStartButton = document.querySelector("[data-hangman-start]");
const hangmanKeyboard = document.querySelector("[data-hangman-keyboard]");
const hangmanWords = document.querySelector("[data-hangman-words]");
const hangmanAttempts = document.querySelector("[data-hangman-attempts]");
const hangmanStatus = document.querySelector("[data-hangman-status]");
const hangmanDrawing = document.querySelector("[data-hangman-drawing]");
const hangmanOutcome = document.querySelector("[data-hangman-outcome]");
const hangmanOutcomeMessage = document.querySelector("[data-hangman-outcome-message]");
const hangmanSecret = document.querySelector("[data-hangman-secret]");
const hangmanLastSurpriseButton = document.querySelector("[data-hangman-last-surprise]");
const hangmanRetryButton = document.querySelector("[data-hangman-retry]");
const hangmanFinalStatus = document.querySelector("[data-hangman-final-status]");
const videoDiscoverButton = document.querySelector("[data-video-discover]");
const specialVideo = document.querySelector("[data-special-video]");
const videoStatus = document.querySelector("[data-video-status]");
const videoEnding = document.querySelector("[data-video-ending]");
const videoEndingDecorations = document.querySelector("[data-video-ending-decorations]");
const pageTransition = document.querySelector("[data-page-transition]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hangmanPhrase = "EU TE AMO, LAIS";
const hangmanAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const hangmanMaxMistakes = 6;
const hangmanGuesses = new Set();
let hangmanMistakes = 0;
let hangmanFinished = false;
let transitionInProgress = false;

async function transitionToScreen(fromScreen, toScreen, onStart, onComplete, waitForFlowerEnd = false) {
  if (transitionInProgress) return;

  transitionInProgress = true;
  if (fromScreen === musicScreen) {
    musicAudio.pause();
    musicAudio.currentTime = 0;
  }

  pageTransition.hidden = false;
  pageTransition.classList.remove("is-active");
  void pageTransition.offsetWidth;
  const transitionFinished = waitForFlowerEnd
    ? new Promise((resolve) => {
      const flowerCenter = pageTransition.querySelector(".petal-transition__center");
      flowerCenter.addEventListener("animationend", (event) => {
        if (event.animationName === "transition-center-fade") resolve();
      }, { once: true });
    })
    : new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 60 : 2900));
  pageTransition.classList.add("is-active");
  fromScreen.classList.add("is-leaving");

  onStart?.();
  await transitionFinished;

  fromScreen.hidden = true;
  fromScreen.classList.remove("is-leaving");
  toScreen.hidden = false;
  onComplete?.();

  pageTransition.hidden = true;
  pageTransition.classList.remove("is-active");
  transitionInProgress = false;
}

// Position each heart in viewport coordinates so the burst begins at the button itself.
function createHeartBurst() {
  const buttonBounds = startButton.getBoundingClientRect();
  const originX = buttonBounds.left + buttonBounds.width / 2;
  const originY = buttonBounds.top + buttonBounds.height / 2;
  const heartCount = 9;
  const safeMargin = 18;

  for (let index = 0; index < heartCount; index += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * index) / heartCount - Math.PI / 2 + (Math.random() - 0.5) * 0.35;
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    const horizontalLimit = directionX > 0
      ? (window.innerWidth - safeMargin - originX) / directionX
      : directionX < 0
        ? (originX - safeMargin) / -directionX
        : Number.POSITIVE_INFINITY;
    const verticalLimit = directionY > 0
      ? (window.innerHeight - safeMargin - originY) / directionY
      : directionY < 0
        ? (originY - safeMargin) / -directionY
        : Number.POSITIVE_INFINITY;
    const requestedDistance = 95 + Math.random() * 85;
    const distance = Math.max(0, Math.min(requestedDistance, horizontalLimit, verticalLimit));

    heart.className = "celebration-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = index % 3 === 0 ? "♡" : "♥";
    heart.style.setProperty("--origin-x", `${originX}px`);
    heart.style.setProperty("--origin-y", `${originY}px`);
    heart.style.setProperty("--dx", `${directionX * distance}px`);
    heart.style.setProperty("--dy", `${directionY * distance}px`);
    heart.style.setProperty("--size", `${0.65 + Math.random() * 0.55}rem`);
    heart.style.setProperty("--rotation", `${Math.round(Math.random() * 70 - 35)}deg`);
    heart.style.setProperty("--duration", `${1.2 + Math.random() * 0.45}s`);
    heart.style.animationDelay = `${Math.random() * 140}ms`;
    welcomeScreen.append(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });

    requestAnimationFrame(() => heart.classList.add("is-bursting"));
  }
}

function showLetterScreen() {
  void transitionToScreen(welcomeScreen, letterScreen);
}

function showMusicScreen() {
  void transitionToScreen(letterScreen, musicScreen);
}

function showHangmanIntro() {
  void transitionToScreen(musicScreen, hangmanIntroScreen);
}

function showHangmanGame() {
  void transitionToScreen(hangmanIntroScreen, hangmanGameScreen, null, resetHangmanGame);
}

function showVideoIntro() {
  if (!hangmanFinished) return;

  void transitionToScreen(hangmanGameScreen, videoIntroScreen);
}

async function showSpecialVideo() {
  if (videoDiscoverButton.disabled || transitionInProgress) return;

  videoDiscoverButton.disabled = true;
  specialVideo.pause();
  specialVideo.currentTime = 0;
  await transitionToScreen(videoIntroScreen, videoScreen, null, null, true);

  specialVideo.play().catch(() => {
    videoStatus.textContent = "O vídeo está pronto. Toque em reproduzir para assistir.";
    videoStatus.hidden = false;
  });
}

function renderHangmanPhrase() {
  hangmanWords.replaceChildren();

  // Only letters become guessable; spaces and punctuation stay visible.
  hangmanPhrase.split(" ").forEach((word) => {
    const wordElement = document.createElement("span");
    const letters = word.endsWith(",") ? word.slice(0, -1) : word;
    wordElement.className = "hangman-word";

    Array.from(letters).forEach((letter) => {
      const letterElement = document.createElement("span");
      letterElement.className = "hangman-letter";
      letterElement.dataset.letter = letter;
      letterElement.textContent = hangmanGuesses.has(letter) ? letter : "";
      letterElement.setAttribute("aria-label", hangmanGuesses.has(letter) ? letter : "letra não revelada");
      letterElement.classList.toggle("is-revealed", hangmanGuesses.has(letter));
      wordElement.append(letterElement);
    });

    if (word.endsWith(",")) {
      const comma = document.createElement("span");
      comma.className = "hangman-comma";
      comma.textContent = ",";
      wordElement.append(comma);
    }

    hangmanWords.append(wordElement);
  });
}

function createHangmanKeyboard() {
  hangmanAlphabet.split("").forEach((letter) => {
    const button = document.createElement("button");
    button.className = "hangman-key";
    button.type = "button";
    button.textContent = letter;
    button.dataset.letter = letter;
    button.setAttribute("aria-label", `Letra ${letter}`);
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => guessHangmanLetter(letter));
    hangmanKeyboard.append(button);
  });
}

function resetHangmanGame() {
  hangmanGuesses.clear();
  hangmanMistakes = 0;
  hangmanFinished = false;
  hangmanAttempts.textContent = String(hangmanMaxMistakes);
  hangmanStatus.textContent = "Adivinhe as letras da mensagem.";
  hangmanDrawing.setAttribute("aria-label", "Desenho da forca, nenhum erro");
  hangmanOutcome.hidden = true;
  hangmanOutcomeMessage.textContent = "";
  hangmanSecret.textContent = "";
  hangmanLastSurpriseButton.hidden = true;
  hangmanRetryButton.hidden = true;
  hangmanFinalStatus.textContent = "";
  hangmanGameScreen.classList.remove("is-won", "is-lost", "has-correct-guess", "has-wrong-guess");

  hangmanGameScreen.querySelectorAll("[data-hangman-part]").forEach((part) => {
    part.classList.remove("is-visible");
  });
  hangmanKeyboard.querySelectorAll(".hangman-key").forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-correct", "is-wrong");
    button.setAttribute("aria-pressed", "false");
  });
  renderHangmanPhrase();
}

function finishHangmanGame(won) {
  hangmanFinished = true;
  hangmanOutcome.hidden = false;
  hangmanKeyboard.querySelectorAll(".hangman-key").forEach((button) => {
    button.disabled = true;
  });

  if (won) {
    hangmanGameScreen.classList.add("is-won");
    hangmanOutcomeMessage.textContent = "Essa era a mensagem que eu estava tentando esconder de você. ❤️";
    hangmanSecret.textContent = `${hangmanPhrase}.`;
    hangmanLastSurpriseButton.hidden = false;
    hangmanStatus.textContent = "Você descobriu a mensagem!";
    createHangmanCelebration();
    return;
  }

  hangmanGameScreen.classList.add("is-lost");
  hangmanOutcomeMessage.textContent = "Não tem problema, meu amor — o importante é brincar juntinhos. A mensagem era:";
  hangmanSecret.textContent = `${hangmanPhrase}.`;
  hangmanRetryButton.hidden = false;
  hangmanStatus.textContent = "A mensagem foi revelada com carinho.";
}

function createHangmanCelebration() {
  const symbols = ["♡", "♥", "♡", "♥", "♡", "♥", "♡", "♥"];

  symbols.forEach((symbol) => {
    const decoration = document.createElement("span");
    decoration.className = "hangman-celebration";
    decoration.setAttribute("aria-hidden", "true");
    decoration.textContent = symbol;
    decoration.style.setProperty("--left", `${8 + Math.random() * 84}%`);
    decoration.style.setProperty("--top", `${10 + Math.random() * 72}%`);
    decoration.style.setProperty("--delay", `${Math.random() * 350}ms`);
    hangmanGameScreen.append(decoration);
    decoration.addEventListener("animationend", () => decoration.remove(), { once: true });
  });
}

function createVideoEndingDecorations() {
  const symbols = ["♡", "♥", "♡", "♥", "♡", "♥"];
  videoEndingDecorations.replaceChildren();

  symbols.forEach((symbol, index) => {
    const decoration = document.createElement("span");
    decoration.className = "video-ending__decoration";
    decoration.setAttribute("aria-hidden", "true");
    decoration.textContent = symbol;
    decoration.style.setProperty("--left", `${8 + (index * 17) % 84}%`);
    decoration.style.setProperty("--top", `${12 + (index * 23) % 72}%`);
    decoration.style.setProperty("--delay", `${index * 110}ms`);
    videoEndingDecorations.append(decoration);
  });
}

function guessHangmanLetter(letter) {
  if (hangmanFinished || hangmanGameScreen.hidden || hangmanGuesses.has(letter)) return;

  hangmanGuesses.add(letter);
  const keyButton = hangmanKeyboard.querySelector(`[data-letter="${letter}"]`);
  keyButton.disabled = true;
  keyButton.setAttribute("aria-pressed", "true");

  if (hangmanPhrase.includes(letter)) {
    keyButton.classList.add("is-correct");
    hangmanGameScreen.classList.remove("has-wrong-guess");
    hangmanGameScreen.classList.add("has-correct-guess");
    hangmanStatus.textContent = `Isso mesmo! A letra ${letter} está na mensagem.`;

    hangmanWords.querySelectorAll(`[data-letter="${letter}"]`).forEach((slot) => {
      slot.textContent = letter;
      slot.setAttribute("aria-label", letter);
      slot.classList.add("is-revealed");
    });

    const lettersToFind = Array.from(hangmanPhrase).filter((character) => /^[A-Z]$/.test(character));
    if (lettersToFind.every((character) => hangmanGuesses.has(character))) {
      finishHangmanGame(true);
    }
    return;
  }

  hangmanMistakes += 1;
  keyButton.classList.add("is-wrong");
  hangmanGameScreen.classList.remove("has-correct-guess");
  hangmanGameScreen.classList.add("has-wrong-guess");
  hangmanAttempts.textContent = String(hangmanMaxMistakes - hangmanMistakes);
  hangmanStatus.textContent = `A letra ${letter} não está na mensagem. Restam ${hangmanMaxMistakes - hangmanMistakes} tentativas.`;
  // Each incorrect guess reveals the next piece of the SVG drawing.
  const part = hangmanGameScreen.querySelector(`[data-hangman-part="${hangmanMistakes}"]`);
  part.classList.add("is-visible");
  hangmanDrawing.setAttribute("aria-label", `Desenho da forca, ${hangmanMistakes} ${hangmanMistakes === 1 ? "erro" : "erros"}`);

  if (hangmanMistakes === hangmanMaxMistakes) {
    renderHangmanPhrase();
    finishHangmanGame(false);
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "--:--";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateAudioProgress() {
  audioCurrentTime.textContent = formatTime(musicAudio.currentTime);

  if (!Number.isFinite(musicAudio.duration)) return;

  audioProgress.disabled = false;
  audioProgress.max = String(musicAudio.duration);
  audioProgress.value = String(musicAudio.currentTime);
  audioDuration.textContent = formatTime(musicAudio.duration);
}

function updatePlaybackState() {
  const isPlaying = !musicAudio.paused && !musicAudio.ended;
  musicPlayer.classList.toggle("is-playing", isPlaying);
  audioPlayButton.setAttribute("aria-pressed", String(isPlaying));
  audioPlayButton.setAttribute("aria-label", isPlaying ? "Pausar Love Maze" : "Reproduzir Love Maze");
  playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
}

musicAudio.volume = Number(audioVolume.value);
musicAudio.addEventListener("loadedmetadata", updateAudioProgress);
musicAudio.addEventListener("durationchange", updateAudioProgress);
musicAudio.addEventListener("timeupdate", updateAudioProgress);
musicAudio.addEventListener("play", updatePlaybackState);
musicAudio.addEventListener("pause", updatePlaybackState);
musicAudio.addEventListener("ended", updatePlaybackState);
musicAudio.addEventListener("error", () => {
  audioError.textContent = "Não foi possível carregar a música. Verifique se o arquivo Love Maze - BTS.mp3 está na pasta imagens.";
  audioError.hidden = false;
  audioPlayButton.disabled = true;
  audioProgress.disabled = true;
});

audioPlayButton.addEventListener("click", async () => {
  if (musicAudio.paused) {
    try {
      await musicAudio.play();
      audioError.hidden = true;
    } catch {
      audioError.textContent = "Não foi possível reproduzir o áudio. Verifique o arquivo e tente novamente.";
      audioError.hidden = false;
    }
  } else {
    musicAudio.pause();
  }
});

audioProgress.addEventListener("input", () => {
  if (!Number.isFinite(musicAudio.duration)) return;

  musicAudio.currentTime = Number(audioProgress.value);
  audioCurrentTime.textContent = formatTime(musicAudio.currentTime);
});

audioVolume.addEventListener("input", () => {
  musicAudio.volume = Number(audioVolume.value);
  musicAudio.muted = musicAudio.volume === 0;
});

startButton.addEventListener("click", () => {
  if (startButton.disabled) return;

  startButton.disabled = true;
  welcomeStatus.textContent = "Uma surpresa está a caminho...";
  createHeartBurst();
  window.setTimeout(showLetterScreen, reducedMotion ? 50 : 1950);
});

envelope.addEventListener("click", () => {
  if (letterScreen.classList.contains("is-open")) return;

  envelope.setAttribute("aria-expanded", "true");
  envelope.setAttribute("aria-label", "Cartinha aberta");
  letterScreen.classList.add("is-open");

  // Let the paper rise from the envelope before bringing it forward for reading.
  window.setTimeout(() => {
    letterScreen.classList.add("is-reading");
    censorToggle.hidden = false;
    letterStatus.textContent = "Sua cartinha está pronta para ser lida.";
  }, reducedMotion ? 50 : 850);
});

censorToggle.addEventListener("click", () => {
  const revealed = censorToggle.getAttribute("aria-pressed") !== "true";
  censorToggle.setAttribute("aria-pressed", String(revealed));
  censorToggle.textContent = revealed ? "Ocultar novamente" : "Remover censura ❤️";
  letterScreen.classList.toggle("is-revealed", revealed);
  letterScreen.classList.add("has-revealed");

  if (revealed) {
    nextSurpriseButton.hidden = false;
    letterStatus.textContent = "As palavras censuradas foram reveladas.";
  } else {
    letterStatus.textContent = "As palavras foram ocultadas novamente.";
  }
});

nextSurpriseButton.addEventListener("click", () => {
  showMusicScreen();
});

musicNextSurpriseButton.addEventListener("click", () => {
  showHangmanIntro();
});

hangmanStartButton.addEventListener("click", showHangmanGame);
hangmanRetryButton.addEventListener("click", resetHangmanGame);
hangmanLastSurpriseButton.addEventListener("click", () => {
  showVideoIntro();
});
createHangmanKeyboard();
resetHangmanGame();
videoDiscoverButton.addEventListener("click", showSpecialVideo);
specialVideo.addEventListener("play", () => {
  videoStatus.hidden = true;
});
specialVideo.addEventListener("ended", () => {
  videoStatus.hidden = true;
  videoEnding.hidden = false;
  videoScreen.classList.add("is-finished");
  createVideoEndingDecorations();
});
specialVideo.addEventListener("error", () => {
  videoStatus.textContent = "Não foi possível carregar o vídeo. Verifique se o arquivo i_love_u.mp4 está na pasta imagens.";
  videoStatus.hidden = false;
});

window.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || !/^[a-z]$/i.test(event.key)) return;

  const letter = event.key.toUpperCase();
  // Physical keyboard input is accepted only while the puzzle is active.
  if (!hangmanGameScreen.hidden && !hangmanFinished) {
    guessHangmanLetter(letter);
  }
});
