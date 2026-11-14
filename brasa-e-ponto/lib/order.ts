import { products, extras, type Product } from "./menu";
import { restaurant } from "./config";
export type CartItem = {
  key: string;
  productId: string;
  extraIds: string[];
  notes: string;
  quantity: number;
};
export type Customer = {
  name: string;
  phone: string;
  type: "delivery" | "pickup";
  street: string;
  number: string;
  district: string;
  complement: string;
  payment: "pix" | "cash" | "card";
  needsChange: boolean;
  change: string;
  notes: string;
};
export const emptyCustomer: Customer = {
  name: "",
  phone: "",
  type: "delivery",
  street: "",
  number: "",
  district: "",
  complement: "",
  payment: "pix",
  needsChange: false,
  change: "",
  notes: "",
};
export const money = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100,
  );
export const getProduct = (id: string): Product =>
  products.find((p) => p.id === id)!;
export const getExtras = (ids: string[]) =>
  extras.filter((e) => ids.includes(e.id));
export const unitPrice = (item: CartItem) =>
  getProduct(item.productId).price +
  getExtras(item.extraIds).reduce((sum, e) => sum + e.price, 0);
export const subtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
export const fee = (type: Customer["type"]) =>
  type === "delivery" ? restaurant.deliveryFee : 0;
export const makeItem = (
  productId: string,
  extraIds: string[],
  notes: string,
  quantity: number,
): CartItem => {
  const sorted = [...new Set(extraIds)].sort();
  const trimmed = notes.trim();
  return {
    key: JSON.stringify([productId, sorted, trimmed]),
    productId,
    extraIds: sorted,
    notes: trimmed,
    quantity,
  };
};
export const addItem = (items: CartItem[], item: CartItem): CartItem[] => {
  const existing = items.find((i) => i.key === item.key);
  return existing
    ? items.map((i) =>
        i.key === item.key
          ? { ...i, quantity: Math.min(99, i.quantity + item.quantity) }
          : i,
      )
    : [...items, item];
};
export function restoreCart(raw: string | null): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.reduce<CartItem[]>((valid, item) => {
      if (!item || typeof item !== "object") return valid;
      const p = products.find((p) => p.id === item.productId);
      if (
        !p ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99 ||
        typeof item.notes !== "string" ||
        !Array.isArray(item.extraIds)
      )
        return valid;
      const ids: string[] = item.extraIds.filter(
        (id: unknown): id is string =>
          typeof id === "string" && p.extraIds.includes(id),
      );
      return addItem(
        valid,
        makeItem(p.id, ids, item.notes.slice(0, 300), item.quantity),
      );
    }, []);
  } catch {
    return [];
  }
}
export function validateCustomer(
  c: Customer,
  total: number,
): Partial<Record<keyof Customer, string>> {
  const errors: Partial<Record<keyof Customer, string>> = {};
  if (c.name.trim().length < 2)
    errors.name = "Informe seu nome (pelo menos 2 letras).";
  if (!/^\d{10,11}$/.test(c.phone.replace(/\D/g, "")))
    errors.phone = "Informe um telefone com DDD (10 ou 11 dígitos).";
  if (c.type === "delivery") {
    if (!c.street.trim()) errors.street = "Informe a rua ou avenida.";
    if (!c.number.trim()) errors.number = "Informe o número ou S/N.";
    if (!c.district.trim()) errors.district = "Informe o bairro.";
  }
  if (c.payment === "cash" && c.needsChange) {
    const change = Number(c.change.replace(",", "."));
    if (!Number.isFinite(change) || Math.round(change * 100) < total)
      errors.change =
        "O valor para troco precisa ser igual ou maior que o total.";
  }
  return errors;
}
export function orderMessage(items: CartItem[], c: Customer): string {
  const sub = subtotal(items);
  const delivery = fee(c.type);
  const lines = [
    "*BRASA & PONTO*",
    "Novo pedido",
    "",
    `Cliente: ${c.name.trim()}`,
    `Telefone: ${c.phone}`,
    `Tipo: ${c.type === "delivery" ? "Entrega" : "Retirada"}`,
    "",
    "*Itens do pedido*",
  ];
  for (const item of items) {
    lines.push(
      `${item.quantity}× ${getProduct(item.productId).name} — ${money(unitPrice(item) * item.quantity)}`,
      `  Unitário com adicionais: ${money(unitPrice(item))}`,
    );
    for (const e of getExtras(item.extraIds))
      lines.push(`  + ${e.name} (${money(e.price)} por unidade)`);
    if (item.notes) lines.push(`  Observação: ${item.notes}`);
  }
  lines.push(
    "",
    `Subtotal: ${money(sub)}`,
    `Entrega: ${delivery ? `${money(delivery)} (taxa demonstrativa)` : "Grátis · retirada"}`,
    `*Total: ${money(sub + delivery)}*`,
  );
  if (c.type === "delivery")
    lines.push(
      "",
      "*Endereço*",
      `${c.street.trim()}, ${c.number.trim()} · ${c.district.trim()}`,
      ...(c.complement.trim() ? [c.complement.trim()] : []),
    );
  lines.push(
    "",
    `Pagamento: ${{ pix: "Pix", cash: "Dinheiro", card: "Cartão na entrega/retirada" }[c.payment]}`,
  );
  if (c.payment === "cash")
    lines.push(
      c.needsChange
        ? `Troco para: ${money(Math.round(Number(c.change.replace(",", ".")) * 100))}`
        : "Não precisa de troco",
    );
  if (c.notes.trim()) lines.push(`Observações gerais: ${c.notes.trim()}`);
  lines.push("", "Projeto demonstrativo · pedido sujeito à confirmação.");
  return lines.join("\n");
}
export const whatsappUrl = (number: string, message: string) =>
  /^\d{10,15}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : null;
