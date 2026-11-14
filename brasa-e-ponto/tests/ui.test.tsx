import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React from "react";
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://brasa.test",
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  HTMLDialogElement: dom.window.HTMLDialogElement,
  localStorage: dom.window.localStorage,
  requestAnimationFrame: (fn: () => void) => setTimeout(fn, 0),
  React,
});
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
Object.defineProperty(dom.window.HTMLDialogElement.prototype, "showModal", {
  value() {
    this.open = true;
  },
});
Object.defineProperty(dom.window.HTMLDialogElement.prototype, "close", {
  value() {
    this.open = false;
  },
});

test("storefront flow: filters, customization, persistence, quantities, checkout and copy", async () => {
  const { render, screen, within, cleanup, waitFor } =
    await import("@testing-library/react");
  const userEvent = (await import("@testing-library/user-event")).default;
  const Storefront = (await import("../components/storefront")).default;
  const { cartStorageKey } = await import("../lib/config");

  const user = userEvent.setup({ document: dom.window.document });
  let copied = "";
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: async (text: string) => {
        copied = text;
      },
    },
    configurable: true,
  });
  render(<Storefront />);
  await user.click(screen.getByRole("tab", { name: /Bebidas/ }));
  assert.equal(
    within(screen.getByRole("tabpanel")).getAllByRole("article").length,
    4,
  );
  await user.click(screen.getByRole("tab", { name: /Sobremesas/ }));
  assert.equal(
    within(screen.getByRole("tabpanel")).getAllByRole("article").length,
    3,
  );
  await user.click(screen.getByRole("tab", { name: /Acompanhamentos/ }));
  assert.equal(
    within(screen.getByRole("tabpanel")).getAllByRole("article").length,
    3,
  );
  await user.click(screen.getByRole("tab", { name: /Burgers/ }));
  await user.click(
    screen.getByRole("button", {
      name: "Adicionar Brasa Original",
    }),
  );
  let dialog = screen.getByRole("dialog", { name: "Brasa Original" });
  await user.click(
    within(dialog).getByRole("checkbox", { name: /Bacon crocante/ }),
  );
  await user.type(
    within(dialog).getByRole("textbox", { name: /Algum pedido especial/ }),
    "Sem cebola",
  );
  await user.click(
    within(dialog).getByRole("button", { name: "Aumentar quantidade" }),
  );
  await user.click(
    within(dialog).getByRole("button", { name: /Adicionar ao carrinho/ }),
  );
  await waitFor(() =>
    assert.equal(
      JSON.parse(localStorage.getItem(cartStorageKey) ?? "[]")[0].quantity,
      2,
    ),
  );
  cleanup();
  render(<Storefront />);
  await waitFor(() =>
    assert.ok(screen.getByRole("button", { name: "Abrir pedido, 2 itens" })),
  );
  await user.click(
    screen.getByRole("button", { name: "Abrir pedido, 2 itens" }),
  );
  dialog = screen.getByRole("dialog", { name: "Seu pedido" });
  assert.match(dialog.textContent ?? "", /Sem cebola/);
  assert.match(dialog.textContent ?? "", /83,80/);
  await user.click(
    within(dialog).getByRole("button", {
      name: /Aumentar quantidade de Brasa Original/i,
    }),
  );
  assert.match(dialog.textContent ?? "", /122,70/);
  await user.click(
    within(dialog).getByRole("button", {
      name: /Diminuir quantidade de Brasa Original/i,
    }),
  );
  await user.click(
    within(dialog).getByRole("button", { name: "Continuar pedido" }),
  );
  await user.click(
    within(dialog).getByRole("button", { name: "Ver prévia do pedido" }),
  );
  assert.equal(dialog.querySelectorAll('[aria-invalid="true"]').length, 5);
  await user.type(
    within(dialog).getByRole("textbox", { name: /Seu nome/ }),
    "Ana Silva",
  );
  await user.type(
    within(dialog).getByRole("textbox", { name: /Telefone com DDD/ }),
    "11999990000",
  );
  await user.click(
    within(dialog).getByRole("button", { name: "Retirada" }),
  );
  assert.equal(
    within(dialog).queryByRole("textbox", { name: /Rua ou avenida/ }),
    null,
  );
  await user.click(
    within(dialog).getByRole("radio", { name: "Dinheiro" }),
  );
  await user.click(
    within(dialog).getByRole("checkbox", { name: "Preciso de troco" }),
  );
  await user.type(
    within(dialog).getByRole("textbox", { name: /Troco para quanto/ }),
    "100,00",
  );
  await user.click(
    within(dialog).getByRole("button", { name: "Ver prévia do pedido" }),
  );
  const message = (
    within(dialog).getByRole("textbox", {
      name: "Mensagem do pedido",
    }) as HTMLTextAreaElement
  ).value;
  for (const expected of [
    "Ana Silva",
    "Retirada",
    "2× Brasa Original",
    "Sem cebola",
    "77,80",
    "Troco para: R$",
  ])
    assert.ok(message.includes(expected), expected);
  assert.equal(
    within(dialog).queryByRole("link", { name: /Finalizar pelo WhatsApp/ }),
    null,
  );
  await user.click(
    within(dialog).getByRole("button", { name: "Copiar mensagem" }),
  );
  assert.equal(copied, message);
  await user.click(within(dialog).getByRole("button", { name: "Fechar janela" }));
  await user.click(screen.getByRole("button", { name: "Abrir pedido, 2 itens" }));
  dialog = screen.getByRole("dialog", { name: "Seu pedido" });
  await user.click(within(dialog).getByRole("button", { name: "Remover Brasa Original" }));
  assert.ok(within(dialog).getByRole("heading", { name: "A fome é o começo." }));
  await waitFor(() => assert.equal(localStorage.getItem(cartStorageKey), "[]"));
  cleanup();
  localStorage.clear();
});
