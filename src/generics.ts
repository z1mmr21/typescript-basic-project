// Step 1: Product Types

type BaseProduct = {
    id: number;
    name: string;
    price: number;
};

type Electronics = BaseProduct & {
    category: 'electronics';
    warrantyPeriod: number; // in months
};

type Clothing = BaseProduct & {
    category: 'clothing';
    size: 'S' | 'M' | 'L' | 'XL';
    material: string;
};

type Book = BaseProduct & {
    category: 'book';
    author: string;
    pages: number;
};

// Step 2: Search and Filter Functions

const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    return products.find(product => product.id === id);
};

const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    return products.filter(product => product.price <= maxPrice);
};

// Step 3: Cart Logic

type CartItem<T> = {
    product: T;
    quantity: number;
};

const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
        // Create a new array to maintain immutability (good practice)
        const newCart = [...cart];
        newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + quantity
        };
        return newCart;
    } else {
        return [...cart, { product, quantity }];
    }
};

const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Step 4: Usage Examples

// Test Data
const electronics: Electronics[] = [
    { id: 1, name: "Smartphone", price: 800, category: 'electronics', warrantyPeriod: 24 },
    { id: 2, name: "Laptop", price: 1500, category: 'electronics', warrantyPeriod: 36 }
];

const clothing: Clothing[] = [
    { id: 3, name: "T-Shirt", price: 25, category: 'clothing', size: 'M', material: 'Cotton' },
    { id: 4, name: "Jeans", price: 60, category: 'clothing', size: 'L', material: 'Denim' }
];

const books: Book[] = [
    { id: 5, name: "TypeScript Handbook", price: 30, category: 'book', author: "Microsoft", pages: 400 },
    { id: 6, name: "Clean Code", price: 45, category: 'book', author: "Robert C. Martin", pages: 464 }
];

console.log("--- Testing Search ---");
const foundPhone = findProduct(electronics, 1);
console.log("Found Phone:", foundPhone);

const foundShirt = findProduct(clothing, 3);
console.log("Found Shirt:", foundShirt);

const notFound = findProduct(books, 99);
console.log("Not Found:", notFound);

console.log("\n--- Testing Filter by Price ---");
const affordableBooks = filterByPrice(books, 40);
console.log("Affordable Books (<$40):", affordableBooks);

console.log("\n--- Testing Cart ---");
let cart: CartItem<BaseProduct>[] = [];

// Adding different types of products to the same cart (since they all extend BaseProduct)
// Note: To store mixed types in one cart, the cart must be typed as CartItem<BaseProduct>
// or CartItem<Electronics | Clothing | Book>

if (foundPhone) {
    cart = addToCart(cart, foundPhone, 1);
    console.log("Added Phone. Cart size:", cart.length);
}

if (foundShirt) {
    cart = addToCart(cart, foundShirt, 2);
    console.log("Added 2 Shirts. Cart size:", cart.length);
}

// Add another phone to test quantity update
if (foundPhone) {
    cart = addToCart(cart, foundPhone, 1);
    console.log("Added another Phone. Phone quantity:", cart.find(i => i.product.id === 1)?.quantity);
}

const total = calculateTotal(cart);
console.log("\nTotal Cart Value:", total);

// Specific Cart Example (only electronics)
let electronicsCart: CartItem<Electronics>[] = [];
electronicsCart = addToCart(electronicsCart, electronics[1], 1); // Add Laptop
console.log("\nElectronics Cart Total:", calculateTotal(electronicsCart));
