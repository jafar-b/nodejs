// 3. Shopping Cart Processor
// Given a cart array of products (each with price, quantity):
// ● Calculate total price
// ● Apply a 10% discount if total > 100
// ● Return the final amount

const cart = [
  { id: 1, name: "Product 1", price: 100, quantity: 2 }, //200
  { id: 2, name: "Product 2", price: 100, quantity: 3 }, //300
  { id: 3, name: "Product 3", price: 100, quantity: 5 }, //500  total==1000
];

function calculateTotal(cart) {
  let total = 0;
  cart.forEach((product) => {
    total += product.price * product.quantity;
  });
  console.log(`Your Total ${total} with discount of 10% is: `);

  if (total > 100) {
    return (total *= 0.9);
  }

  console.log("Your Total is: ");
  return total;
}

console.log(calculateTotal(cart));
