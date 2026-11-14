import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../lib/menu";
import {
  makeItem,
  addItem,
  restoreCart,
  unitPrice,
  subtotal,
  fee,
  validateCustomer,
  emptyCustomer,
  orderMessage,
  whatsappUrl,
  type Customer,
} from "../lib/order";
const customer: Customer = {
  ...emptyCustomer,
  name: "Ana Silva",
  phone: "(11) 99999-0000",
  street: "Rua Teste",
  number: "25",
  district: "Centro",
};
test("all 16 products can be added, priced, and restored", () => {
  const cart = products.map((p) =>
    makeItem(p.id, p.extraIds, "Molho à parte", 2),
  );
  assert.equal(cart.length, 16);
  assert.deepEqual(restoreCart(JSON.stringify(cart)), cart);
  for (const item of cart) assert.ok(unitPrice(item) > 0);
});
test("extras are charged for each unit with exact cents", () => {
  const item = makeItem("original", ["bacon", "cheddar"], "Sem cebola", 3);
  assert.equal(unitPrice(item), 4290);
  assert.equal(subtotal([item]), 12870);
  assert.equal(subtotal([item]) + fee("delivery"), 13470);
  assert.equal(fee("pickup"), 0);
});
test("equivalent customization merges; distinct notes or extras stay separate", () => {
  let cart = addItem(
    [],
    makeItem("original", ["bacon", "cheddar"], "Sem cebola", 1),
  );
  cart = addItem(
    cart,
    makeItem("original", ["cheddar", "bacon"], " Sem cebola ", 2),
  );
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 3);
  cart = addItem(cart, makeItem("original", ["bacon"], "Sem cebola", 1));
  cart = addItem(cart, makeItem("original", ["bacon"], "Sem tomate", 1));
  assert.equal(cart.length, 3);
});
test("corrupt storage and removed products do not break checkout", () => {
  assert.deepEqual(restoreCart("broken"), []);
  assert.deepEqual(restoreCart("{}"), []);
  assert.deepEqual(
    restoreCart(JSON.stringify([{ productId: "gone", quantity: 1 }])),
    [],
  );
  assert.deepEqual(
    restoreCart(
      JSON.stringify([{ ...makeItem("original", [], "", 1), quantity: -1 }]),
    ),
    [],
  );
  const restored = restoreCart(
    JSON.stringify([
      {
        ...makeItem("original", [], "", 1),
        extraIds: ["fake", "cheddar", "cheddar"],
        price: 0,
      },
    ]),
  );
  assert.equal(unitPrice(restored[0]), 3690);
  assert.deepEqual(restored[0].extraIds, ["cheddar"]);
});
test("checkout requires identity and delivery address, but no address for pickup", () => {
  const invalid = validateCustomer(emptyCustomer, 3890);
  assert.ok(
    invalid.name &&
      invalid.phone &&
      invalid.street &&
      invalid.number &&
      invalid.district,
  );
  assert.deepEqual(validateCustomer(customer, 3890), {});
  assert.deepEqual(
    validateCustomer(
      { ...emptyCustomer, name: "Ana", phone: "11999990000", type: "pickup" },
      3290,
    ),
    {},
  );
});
test("change must cover total and is ignored for non-cash payments", () => {
  assert.ok(
    validateCustomer(
      { ...customer, payment: "cash", needsChange: true, change: "30" },
      3890,
    ).change,
  );
  assert.ok(
    validateCustomer(
      { ...customer, payment: "cash", needsChange: true, change: "" },
      3890,
    ).change,
  );
  assert.ok(
    validateCustomer(
      { ...customer, payment: "cash", needsChange: true, change: "abc" },
      3890,
    ).change,
  );
  assert.deepEqual(
    validateCustomer(
      { ...customer, payment: "cash", needsChange: true, change: "50,00" },
      3890,
    ),
    {},
  );
  assert.deepEqual(
    validateCustomer(
      { ...customer, payment: "pix", needsChange: true, change: "1" },
      3890,
    ),
    {},
  );
});
test("message includes customizations, quantities, totals and delivery details", () => {
  const cart = [makeItem("original", ["bacon"], "Sem cebola", 2)];
  const message = orderMessage(cart, {
    ...customer,
    complement: "Apto 2",
    payment: "cash",
    needsChange: true,
    change: "100",
    notes: "Tocar interfone",
  });
  for (const expected of [
    "2× Brasa Original",
    "Bacon crocante",
    "Sem cebola",
    "77,80",
    "6,00",
    "83,80",
    "Rua Teste, 25",
    "Apto 2",
    "Dinheiro",
    "100,00",
    "Tocar interfone",
  ])
    assert.ok(message.includes(expected), expected);
  const pickup = orderMessage(cart, { ...customer, type: "pickup" });
  assert.ok(!pickup.includes("Rua Teste"));
  assert.ok(pickup.includes("Grátis · retirada"));
});
test("WhatsApp remains disabled with no configured number and safely encodes content", () => {
  assert.equal(whatsappUrl("", "Pedido"), null);
  assert.equal(whatsappUrl("abc", "Pedido"), null);
  const message = "Brasa & Ponto\nSem cebola + molho";
  const link = whatsappUrl("5500000000000", message)!;
  assert.equal(new URL(link).searchParams.get("text"), message);
});
