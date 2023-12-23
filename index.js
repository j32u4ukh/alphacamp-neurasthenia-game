const SYMBOLS = [
  // 黑桃
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png",
  // 愛心
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png",
  // 方塊
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png",
  // 梅花
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png",
];

const GAME_STATE = {
  WaitFirstCard: "WaitFirstCard",
  WaitSecondCard: "WaitSecondCard",
  CardMatching: "CardMatching",
  GameFinished: "GameFinished",
};

const utility = {
  getRandomNumbers(count) {
    const numbers = Array.from(Array(count).keys());
    for (let index = numbers.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [numbers[index], numbers[randomIndex]] = [
        numbers[randomIndex],
        numbers[index],
      ];
    }
    return numbers;
  },
};

const model = {
  first: null,
  second: null,
  score: 0,
  nTry: 0,
  timeout: 1000,
  resetCrads() {
    this.first = null;
    this.second = null;
  },
  isMatched() {
    if (this.first === null || this.second === null) {
      return false;
    }
    const first = Number(this.first.dataset.index) % 13;
    const second = Number(this.second.dataset.index) % 13;
    return first === second;
  },
};

const view = {
  score: null,
  tried: null,
  init() {
    this.score = document.querySelector(".score");
    this.tried = document.querySelector(".tried");
  },
  displayCards(numbers) {
    const cards = document.querySelector("#cards");
    cards.innerHTML = numbers
      .map((index) => this.getCardElement(index))
      .join("");
  },
  getCardElement(index) {
    if (index < 0 || 52 <= index) {
      return "";
    }
    return `<div data-index="${index}" class="card back"></div>`;
  },
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1);
    const symbol = SYMBOLS[Math.floor(index / 13)];
    return `
      <p>${number}</p>
      <img src="${symbol}" />
      <p>${number}</p>
    `;
  },
  transformNumber(number) {
    switch (number) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return number;
    }
  },
  flipCards(...cards) {
    cards.map((card) => {
      // 翻到正面
      if (card.classList.contains("back")) {
        card.classList.remove("back");
        card.innerHTML = this.getCardContent(Number(card.dataset.index));
      }
      // 翻到背面
      else {
        card.classList.add("back");
        card.innerHTML = null;
      }
    });
  },
  pairedCard(firstCard, secondCard) {
    firstCard.classList.add("paired");
    secondCard.classList.add("paired");
  },
  updateScore(score) {
    this.score.innerHTML = `Score: ${score}`;
  },
  updateTriedTime(nTry) {
    this.tried.innerHTML = `You've tried: ${nTry} times`;
  },
  appendWrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add("wrong");
      card.addEventListener(
        "animationend",
        (event) => event.target.classList.remove("wrong"),
        { once: true }
      );
    });
  },
  showGameFinished() {
    const div = document.createElement("div");
    div.classList.add("completed");
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.nTry} times</p>
    `;
    const header = document.querySelector("header");
    header.before(div);
  },
};

const controller = {
  game_state: GAME_STATE.WaitFirstCard,
  init() {
    view.init();
    view.displayCards(utility.getRandomNumbers(52));

    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", (event) => {
        this.onClickListener(card);
      });
    });
  },
  handleSuccess() {
    // Update score
    model.score += 10;
    view.updateScore(model.score);
    view.pairedCard(model.first, model.second);
    // Change game state according to the score
    if (model.score === 260) {
      view.showGameFinished();
      this.game_state = GAME_STATE.GameFinished;
    } else {
      this.game_state = GAME_STATE.WaitFirstCard;
    }
    // Reset model data
    model.resetCrads();
  },
  handleFailed() {
    view.appendWrongAnimation(model.first, model.second);
    setTimeout(() => {
      // Reset card state
      view.flipCards(model.first, model.second);

      // Reset model data
      model.resetCrads();

      // Change game state according to matching result
      this.game_state = GAME_STATE.WaitFirstCard;
    }, model.timeout);
  },
  onClickListener(card) {
    if (!card.classList.contains("back")) {
      return;
    }
    switch (this.game_state) {
      case GAME_STATE.WaitFirstCard:
        model.first = card;
        view.flipCards(card);
        this.game_state = GAME_STATE.WaitSecondCard;
        break;
      case GAME_STATE.WaitSecondCard:
        this.game_state = GAME_STATE.CardMatching;
        model.second = card;
        model.nTry++;
        view.updateTriedTime(model.nTry);
        view.flipCards(card);
        // Check if cards matched
        if (model.isMatched()) {
          this.handleSuccess();
        } else {
          this.handleFailed();
        }
        break;
      case GAME_STATE.GameFinished:
        break;
    }
  },
};

controller.init();
