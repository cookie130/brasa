"use client";
import Image from "next/image";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { type Product, imagePath } from "@/lib/menu";
import { getExtras, makeItem, money, type CartItem } from "@/lib/order";
import { Quantity } from "./dialog";
export function ProductDetail({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (item: CartItem) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const total =
    (product.price + getExtras(selected).reduce((sum, e) => sum + e.price, 0)) *
    quantity;
  return (
    <>
      <div className="detail-photo">
        <Image
          src={imagePath(product)}
          alt={product.name}
          fill
          sizes="(max-width: 600px) 100vw, 600px"
        />
        {product.badge && <span className="photo-badge">{product.badge}</span>}
      </div>
      <div className="detail-body">
        <span className="eyebrow">FEITO COM TEMPO. PEDIDO COM FOME.</span>
        <h2>{product.name}</h2>
        <p className="muted">{product.description}</p>
        <strong className="detail-price">{money(product.price)}</strong>
        {product.extraIds.length > 0 && (
          <fieldset className="extras">
            <legend>
              Um toque a mais <span>Opcional</span>
            </legend>
            {getExtras(product.extraIds).map((extra) => (
              <label key={extra.id} className="extra-option">
                <input
                  type="checkbox"
                  checked={selected.includes(extra.id)}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [...selected, extra.id]
                        : selected.filter((id) => id !== extra.id),
                    )
                  }
                />
                <span className="check-mark">
                  <Check size={14} />
                </span>
                <span>{extra.name}</span>
                <strong>+ {money(extra.price)}</strong>
              </label>
            ))}
          </fieldset>
        )}
        <label className="field">
          Algum pedido especial?
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Sem cebola? Molho à parte? Conte para a gente."
          />
          <small>{notes.length}/300 caracteres</small>
        </label>
        <p className="allergen-note">
          Em caso de alergia ou restrição alimentar, confirme os ingredientes e
          o preparo com o restaurante.
        </p>
      </div>
      <div className="detail-bottom">
        <Quantity value={quantity} onChange={setQuantity} />
        <button
          className="button primary"
          onClick={() => onAdd(makeItem(product.id, selected, notes, quantity))}
        >
          <Plus size={18} />
          <span>Adicionar ao carrinho</span>
          <strong>{money(total)}</strong>
        </button>
      </div>
    </>
  );
}
