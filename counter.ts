import {createEffect, createEvent, createStore, sample} from "effector";

type Product = {
    price: number;
    name: string;
    id: number;
};

const productsArray: Array<Product> = [
    {
        price: 123,
        name: "Plank",
        id: 21365,
    },
    {
        price: 566,
        name: "Bed",
        id: 13325,
    },
];

const product1: Product = {
    price: 899,
    name: "Vase",
    id: 1118,
};

const productAdded = createEvent<Product>();
const productDeleted = createEvent<Product>();
const arrayProductAdded = createEvent<Array<Product>>();
const arrayProductDeleted = createEvent<Array<Product>>();
const sendCart = createEvent<void>();
const $productCart = createStore<Array<Product>>([]);

$productCart
    .on(productAdded, (cart: Array<Product>, productToAdd: Product) =>
            [...cart, productToAdd])
    .on(productDeleted, (cart: Array<Product>, productToDelete: Product) =>
            cart.filter(item => item.id !== productToDelete.id))
    .on(arrayProductAdded, (cart: Array<Product>, productsToAdd: Array<Product>) =>
            [...cart, ...productsToAdd])
    .on(arrayProductDeleted, (cart: Array<Product>, productsToDelete: Array<Product>) => {
            return cart.filter((a) => !productsToDelete.find((i) =>
                i.id === a.id));
            });

$productCart.watch((value) => {
    console.log("$Product Cart:", value);
});

const sendToServerFx = createEffect(async (products: Array<Product>) => {
    await new Promise((res) => setTimeout(res, 1000));
    console.log("Cart sent successfully", products);
});

sample({
    clock: sendCart,
    source: $productCart,
    target: sendToServerFx,
});

arrayProductAdded(productsArray)
productAdded(product1);
sendCart();
arrayProductDeleted(productsArray);
productDeleted(product1);
sendCart();
productAdded({
    price: 311,
    name: "y",
    id: 121,
});
sendCart();
