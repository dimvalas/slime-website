class Basket {
    private items: Item[] = [];

    addItem(item: Item): void {
        this.items.push(item);
    }

    removeItem(itemId: string): void {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    getItems(): Item[] {
        return this.items;
    }
}

export default Basket;