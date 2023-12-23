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
    cards.innerHTML = this.getCardElement(12);
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

view.displayCards();
