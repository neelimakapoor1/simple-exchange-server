module.exports = class Order {
  constructor(id, type, price, amount) {
    this.id = id;
    this.type = type;
    this.price = Number((price).toFixed(2));
    this.amount = Number((amount).toFixed(2));
  }
}
