import { Basket } from './basket';
import { Item } from './items';

// Initialize the basket system
const basket = new Basket();

// Example of adding items to the basket
const item1: Item = { id: '1', name: 'Apple', price: 0.5 };
const item2: Item = { id: '2', name: 'Banana', price: 0.3 };

basket.addItem(item1);
basket.addItem(item2);

// Log the current items in the basket
console.log('Current items in the basket:', basket.getItems());

// Example of removing an item from the basket
basket.removeItem('1');

// Log the updated items in the basket
console.log('Updated items in the basket:', basket.getItems());