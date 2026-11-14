"use client";
import Image from "next/image";
import { useState, useRef, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Bike,
  Store,
  Check,
  Copy,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import {
  type CartItem,
  type Customer,
  emptyCustomer,
  money,
  getProduct,
  getExtras,
  unitPrice,
  subtotal,
  fee,
  validateCustomer,
  orderMessage,
  whatsappUrl,
} from "@/lib/order";
import { restaurant } from "@/lib/config";
import { imagePath } from "@/lib/menu";
import { Quantity } from "./dialog";
type Props = {
  items: CartItem[];
  update: (key: string, quantity: number) => void;
  close: () => void;
};
export function OrderPanel({ items, update, close }: Props) {
  const [step, setStep] = useState<"cart" | "checkout" | "preview">("cart");
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>(
    {},
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const sub = subtotal(items),
    delivery = fee(customer.type),
    total = sub + delivery;
  const message = orderMessage(items, customer);
  const link = whatsappUrl(restaurant.whatsappNumber, message);
  function change<K extends keyof Customer>(key: K, value: Customer[K]) {
    setCustomer((c) => ({ ...c, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    const found = validateCustomer(customer, total);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setCopied(false);
    setCopyError(false);
    setStep("preview");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
      messageRef.current?.focus();
      messageRef.current?.select();
    }
  }
  const field = (
    key:
      | "name"
      | "phone"
      | "street"
      | "number"
      | "district"
      | "complement"
      | "change",
    label: string,
    placeholder: string,
    autoComplete?: string,
  ) => (
    <label className="field" key={key}>
      {label}
      <input
        name={key}
        value={customer[key]}
        onChange={(e) => change(key, e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={key === "phone" ? 20 : 120}
        inputMode={
          key === "phone" ? "tel" : key === "change" ? "decimal" : "text"
        }
        type={key === "phone" ? "tel" : "text"}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `error-${key}` : undefined}
      />
      {errors[key] && (
        <small className="field-error" id={`error-${key}`}>
          {errors[key]}
        </small>
      )}
    </label>
  );
  const summary = (
    <div className="order-summary">
      <div>
        <span>Subtotal</span>
        <span>{money(sub)}</span>
      </div>
      <div>
        <span>
          {customer.type === "delivery"
            ? "Entrega · taxa demonstrativa"
            : "Retirada no balcão"}
        </span>
        <span>{delivery ? money(delivery) : "Grátis"}</span>
      </div>
      <div className="summary-total">
        <strong>Total</strong>
        <strong>{money(total)}</strong>
      </div>
    </div>
  );
  return (
    <div className="order-panel">
      <header className="panel-header">
        <span className="eyebrow">DO PRIMEIRO DESEJO À ÚLTIMA MORDIDA</span>
        <h2>
          {step === "cart"
            ? "Seu pedido."
            : step === "checkout"
              ? "Quase na mesa."
              : "Tudo no ponto."}
        </h2>
        <p className="muted">
          {step === "cart"
            ? `${count} ${count === 1 ? "item escolhido" : "itens escolhidos"} com personalidade.`
            : step === "checkout"
              ? "Só mais alguns detalhes para preparar seu pedido."
              : "Confira a mensagem antes de continuar."}
        </p>
      </header>
      {items.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={54} strokeWidth={1} />
          <h3>A fome é o começo.</h3>
          <p>
            O próximo passo é escolher seu favorito.
            <br />A gente cuida do resto.
          </p>
          <button className="button primary" onClick={close}>
            Explorar cardápio <ArrowRight size={18} />
          </button>
        </div>
      ) : step === "cart" ? (
        <>
          <div className="cart-list">
            {items.map((item) => {
              const product = getProduct(item.productId);
              return (
                <article key={item.key} className="cart-item">
                  <div className="cart-photo">
                    <Image
                      src={imagePath(product)}
                      alt={product.name}
                      fill
                      sizes="80px"
                    />
                  </div>
                  <div className="cart-item-info">
                    <h3>{product.name}</h3>
                    {getExtras(item.extraIds).map((extra) => (
                      <p key={extra.id}>
                        + {extra.name} · {money(extra.price)}
                      </p>
                    ))}
                    {item.notes && <p className="item-notes">“{item.notes}”</p>}
                    <div className="cart-item-bottom">
                      <Quantity
                        value={item.quantity}
                        onChange={(n) => update(item.key, n)}
                        label={`Quantidade de ${product.name}`}
                      />
                      <strong>{money(unitPrice(item) * item.quantity)}</strong>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => update(item.key, 0)}
                    aria-label={`Remover ${product.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </article>
              );
            })}
          </div>
          <div className="cart-bottom">
            <fieldset className="fulfillment">
              <legend>Como vai ser hoje?</legend>
              <div className="segmented">
                <button
                  className={customer.type === "delivery" ? "selected" : ""}
                  aria-pressed={customer.type === "delivery"}
                  onClick={() => change("type", "delivery")}
                >
                  <Bike size={19} /> Entrega
                </button>
                <button
                  className={customer.type === "pickup" ? "selected" : ""}
                  aria-pressed={customer.type === "pickup"}
                  onClick={() => change("type", "pickup")}
                >
                  <Store size={19} /> Retirada
                </button>
              </div>
            </fieldset>
            {summary}
            <button
              className="button primary full"
              onClick={() => setStep("checkout")}
            >
              Continuar pedido <ArrowRight size={19} />
            </button>
            <button className="text-button full" onClick={close}>
              Escolher mais alguma coisa
            </button>
          </div>
        </>
      ) : step === "checkout" ? (
        <form
          ref={formRef}
          className="checkout-form"
          onSubmit={submit}
          noValidate
        >
          <button
            type="button"
            className="text-button back-button"
            onClick={() => setStep("cart")}
          >
            <ArrowLeft size={16} /> Voltar ao carrinho
          </button>
          <h3>Seus dados</h3>
          {field("name", "Seu nome *", "Como podemos chamar você?", "name")}
          {field("phone", "Telefone com DDD *", "(11) 99999-9999", "tel")}
          <fieldset className="fulfillment">
            <legend>Entrega ou retirada?</legend>
            <div className="segmented">
              <button
                type="button"
                className={customer.type === "delivery" ? "selected" : ""}
                aria-pressed={customer.type === "delivery"}
                onClick={() => change("type", "delivery")}
              >
                <Bike size={18} /> Entrega
              </button>
              <button
                type="button"
                className={customer.type === "pickup" ? "selected" : ""}
                aria-pressed={customer.type === "pickup"}
                onClick={() => change("type", "pickup")}
              >
                <Store size={18} /> Retirada
              </button>
            </div>
          </fieldset>
          {customer.type === "delivery" ? (
            <>
              <h3>Onde a fome está?</h3>
              {field(
                "street",
                "Rua ou avenida *",
                "Nome da rua",
                "address-line1",
              )}
              <div className="form-row">
                {field("number", "Número *", "123 ou S/N")}
                {field("district", "Bairro *", "Seu bairro", "address-level3")}
              </div>
              {field(
                "complement",
                "Complemento",
                "Apartamento, bloco, referência",
                "address-line2",
              )}
              <p className="form-hint">
                Entrega demonstrativa: {money(restaurant.deliveryFee)}. O
                endereço e a disponibilidade serão confirmados pelo restaurante.
              </p>
            </>
          ) : (
            <div className="pickup-note">
              <Store size={21} />
              <p>
                Retirada no balcão
                <br />
                <strong>{restaurant.address}</strong>
                <br />
                <small>Endereço fictício para demonstração.</small>
              </p>
            </div>
          )}
          <fieldset className="payment-options">
            <legend>Como prefere pagar?</legend>
            {(["pix", "cash", "card"] as const).map((method) => (
              <label key={method}>
                <input
                  type="radio"
                  name="payment"
                  checked={customer.payment === method}
                  onChange={() => change("payment", method)}
                />
                <span>
                  {{ pix: "Pix", cash: "Dinheiro", card: "Cartão" }[method]}
                </span>
              </label>
            ))}
          </fieldset>
          <p className="form-hint">
            Pagamento combinado na entrega ou retirada. Nenhum valor é cobrado
            neste site.
          </p>
          {customer.payment === "cash" && (
            <>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={customer.needsChange}
                  onChange={(e) => change("needsChange", e.target.checked)}
                />{" "}
                Preciso de troco
              </label>
              {customer.needsChange &&
                field("change", "Troco para quanto? *", "Ex.: 100,00")}
            </>
          )}
          <label className="field">
            Observações gerais
            <textarea
              value={customer.notes}
              onChange={(e) => change("notes", e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Algo mais que precisamos saber?"
            />
          </label>
          {summary}
          <button className="button primary full" type="submit">
            <MessageCircle size={19} />{" "}
            {link ? "Revisar pedido para WhatsApp" : "Ver prévia do pedido"}
            <ArrowRight size={18} />
          </button>
          <p className="secure-note">
            <ShieldCheck size={15} /> Seus dados ficam neste navegador até você
            compartilhar.
          </p>
        </form>
      ) : (
        <div className="preview-panel">
          <button
            className="text-button back-button"
            onClick={() => setStep("checkout")}
          >
            <ArrowLeft size={16} /> Editar dados do pedido
          </button>
          {!link && (
            <div className="demo-note">
              <strong>Uma experiência de demonstração.</strong>
              <p>
                O WhatsApp da hamburgueria ainda não está configurado. Você pode
                copiar a mensagem; nenhum pedido será enviado.
              </p>
            </div>
          )}
          <label className="field">
            Mensagem do pedido
            <textarea
              ref={messageRef}
              className="message-preview"
              value={message}
              readOnly
              rows={17}
            />
          </label>
          {link && (
            <a
              className="button primary full"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} /> Finalizar pelo WhatsApp{" "}
              <ArrowRight size={18} />
            </a>
          )}
          <button
            className={`button ${link ? "outline" : "primary"} full`}
            onClick={copy}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Mensagem copiada!" : "Copiar mensagem"}
          </button>
          <p role="status" className="form-hint">
            {copyError
              ? "Não foi possível copiar automaticamente. A mensagem está selecionada: use Ctrl+C ou a opção Copiar do celular."
              : copied
                ? "Pronto! A mensagem está na sua área de transferência."
                : "O carrinho permanece salvo para você continuar depois."}
          </p>
        </div>
      )}
    </div>
  );
}
