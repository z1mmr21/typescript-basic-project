const userName: string = "Mark Jesus";
const greeting: string = `Привіт, ${userName}!`;

const age: number = 22;
const price: number = 99.99;
const hexValue: number = 0xff;

const isActive: boolean = true;
const hasAccess: boolean = false;

function displayUserInfo(name: string, age: number, isActive: boolean): void {
  console.log(`Ім'я: ${name}`);
  console.log(`Вік: ${age}`);
  console.log(`Активний: ${isActive ? "Так" : "Ні"}`);
}

function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

console.log(greeting);
console.log("=".repeat(40));

displayUserInfo(userName, age, isActive);

console.log("=".repeat(40));

const quantity: number = 3;
const total: number = calculateTotal(price, quantity);
console.log(`Ціна за одиницю: ${price} грн`);
console.log(`Кількість: ${quantity}`);
console.log(`Загальна вартість: ${total} грн`);
