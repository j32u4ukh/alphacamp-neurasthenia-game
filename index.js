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

const view = {
  displayCards() {
    const cards = document.querySelector("#cards");
    cards.innerHTML = utility
      .getRandomNumbers(52)
      .map((index) => this.getCardElement(index))
      .join("");
  },
  getCardElement(index) {
    if (index < 0 || 52 <= index) {
      return "";
    }
    const number = this.transformNumber((index % 13) + 1);
    const symbol = SYMBOLS[Math.floor(index / 13)];
    return `
      <div class="card">
        <p>${number}</p>
        <img src="${symbol}" />
        <p>${number}</p>
      </div>`;
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

view.displayCards();
