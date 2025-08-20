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

export const productAdded = createEvent<Product>();
export const productDeleted = createEvent<Product>();
const arrayProductAdded = createEvent<Array<Product>>();
const arrayProductDeleted = createEvent<Array<Product>>();
const clearCart = createEvent<void>();
export const sendCart = createEvent<void>();
export const getCart = createEvent<void>();
export const $productCart = createStore<Array<Product>>([]);

$productCart
    .on(productAdded, (cart: Array<Product>, productToAdd: Product) =>
        [...cart, productToAdd])
    .on(productDeleted, (cart: Array<Product>, productToDelete: Product) =>
        cart.filter(item => item.id !== productToDelete.id))
    .on(clearCart, () => [])
    .on(arrayProductAdded, (cart: Array<Product>, productsToAdd: Array<Product>) =>
        [...cart, ...productsToAdd])
    .on(arrayProductDeleted, (cart: Array<Product>, productsToDelete: Array<Product>) => {
        return cart.filter((a) => !productsToDelete.find((i) =>
            i.id === a.id));
    });

$productCart.watch((value) => {
    console.log("$Product Cart:", value);
});

export const sendToServerFx = createEffect(async (products: Array<Product>) => {
    await new Promise((res) => setTimeout(res, 1000));
    console.log("Cart sent successfully", products);
});

export const getCartFromServerFx = createEffect(async () => {
    await new Promise((res) => setTimeout(res, 1000));
    return [
        {price: 1775, name: "Chair", id: 453},
        {price: 34465, name: "Table", id: 578},
    ];
});

sample({
    clock: sendCart,
    source: $productCart,
    target: sendToServerFx,
});


sample({
    clock: getCart,
    target: getCartFromServerFx,
});

sample({
    clock: getCartFromServerFx.doneData,
    target: clearCart,
});


sample({
    clock: getCartFromServerFx.doneData,
    target: arrayProductAdded,
});

sample({
    clock: clearCart,
    fn: () => productsArray,
    target: arrayProductAdded,
});

sample ({
    clock: arrayProductAdded,
    fn: () => product1,
    target: productAdded,
});

sample ({
    clock: productAdded,
    fn: () => product1,
    target: productDeleted,
});

sample ({
    clock: [arrayProductAdded, productAdded],
    target: sendCart,
});

getCart();


//посмотреть через массивы
// sample ({
//     clock: getCartFromServerFx.doneData,
//     target: [clearCart, sendCart],
// })

//Типа дерево с корнем в getCart что за чем идет, через сэмплы!!!!!

// setTimeout(() => {
//        clearCart();
//     arrayProductAdded(productsArray);
//     productAdded(product1);
//     sendCart(); //эти несколько раз через сэмплы
//     arrayProductDeleted(productsArray);
//     productDeleted(product1);
//     sendCart();
//     productAdded({
//         price: 311,
//         name: "y",
//         id: 121,
//     });
//     sendCart();
// }, 3000);
//