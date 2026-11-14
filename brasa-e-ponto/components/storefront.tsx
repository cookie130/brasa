"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Flame,
  ShoppingBag,
  Menu,
  X,
  Plus,
  Clock3,
  Bike,
  MapPin,
  Utensils,
  Leaf,
  Beef,
  CupSoda,
  IceCreamBowl,
  Check,
  ChefHat,
} from "lucide-react";
import {
  categories,
  products,
  imagePath,
  type Category,
  type Product,
} from "@/lib/menu";
import { restaurant, cartStorageKey } from "@/lib/config";
import {
  addItem,
  restoreCart,
  money,
  subtotal,
  type CartItem,
} from "@/lib/order";
import { Dialog } from "./dialog";
import { ProductDetail } from "./product-detail";
import { OrderPanel } from "./order-panel";
const categoryIcons = {
  burgers: Beef,
  sides: Utensils,
  drinks: CupSoda,
  desserts: IceCreamBowl,
};
function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`wordmark ${footer ? "footer-wordmark" : ""}`}>
      BRASA<span className="wordmark-amp">&</span>PONTO
      <span className="wordmark-caption">HAMBURGUERIA ARTESANAL</span>
    </span>
  );
}
export default function Storefront() {
  const [category, setCategory] = useState<Category>("burgers");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    try {
      // Hydrate browser-only storage after SSR; never store customer information.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(restoreCart(localStorage.getItem(cartStorageKey)));
    } catch {
      setStorageWarning(true);
    }
    setLoaded(true);
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageWarning(true);
    }
  }, [cart, loaded]);
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  function add(item: CartItem) {
    setCart((items) => addItem(items, item));
    setSelectedProduct(null);
    setToast("Boa escolha! Adicionado ao pedido.");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  }
  function update(key: string, quantity: number) {
    setCart((items) =>
      quantity <= 0
        ? items.filter((i) => i.key !== key)
        : items.map((i) =>
            i.key === key ? { ...i, quantity: Math.min(99, quantity) } : i,
          ),
    );
  }
  function chooseCategory(id: Category) {
    setCategory(id);
  }
  return (
    <>
      <a href="#cardapio" className="skip-link">
        Pular para o cardápio
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand-link"
            href="#inicio"
            aria-label="Brasa & Ponto, início"
          >
            <Wordmark />
          </a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#inicio">Início</a>
            <a href="#cardapio">Cardápio</a>
            <a href="#sobre">Nossa essência</a>
            <a href="#contato">Contato</a>
          </nav>
          <div className="header-actions">
            <button
              className="header-cart"
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir pedido, ${count} itens`}
            >
              <ShoppingBag size={18} />
              <span>Meu pedido</span>
              <span className="cart-count">{count}</span>
            </button>
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Navegação mobile"
          >
            {[
              ["#inicio", "Início"],
              ["#cardapio", "Cardápio"],
              ["#sobre", "Nossa essência"],
              ["#contato", "Contato"],
            ].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>
      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">
              <span className="little-line" /> FOGO ACESO. SABOR DE VERDADE.
            </span>
            <h1>
              Fogo, sabor
              <br />e <span>personalidade.</span>
            </h1>
            <p>
              Hambúrgueres artesanais feitos com ingredientes selecionados,
              combinações autorais e aquele sabor que merece ser repetido.
            </p>
            <div className="hero-buttons">
              <a className="button primary" href="#cardapio">
                Explorar cardápio <ArrowUpRight size={20} />
              </a>
              <button
                className="hero-secondary"
                onClick={() => {
                  if (count) setCartOpen(true);
                  else
                    document
                      .getElementById("cardapio")
                      ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Fazer meu pedido <ArrowRight size={18} />
              </button>
            </div>
            <div className="hero-details">
              <span>
                <Bike size={18} /> Entrega e retirada
              </span>
              <span>
                <Clock3 size={18} /> {restaurant.deliveryEstimate}
                <small>estimativa ilustrativa</small>
              </span>
            </div>
            <a className="hero-scroll" href="#cardapio">
              <ArrowDown size={16} /> BOM MESMO É A PRIMEIRA MORDIDA
            </a>
          </div>
          <div className="hero-visual">
            <Image
              src="/images/hero.webp"
              alt="Hambúrguer artesanal com queijo derretido, alface e tomate em pão dourado de gergelim"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 55vw"
            />
            <div className="photo-grain" />
            <span className="hero-photo-label">ARTESANAL POR NATUREZA.</span>
            <div className="fire-seal">
              <span>SEM ATALHOS</span>
              <Flame size={37} strokeWidth={1.3} />
              <strong>SÓ BRASA.</strong>
              <span>FEITO COM ALMA</span>
            </div>
            <div className="hero-photo-caption">
              <span>O CLÁSSICO QUE TEM A NOSSA CARA</span>
              <strong>
                Brasa Original <ArrowUpRight size={21} />
              </strong>
            </div>
            <button
              className="hero-product-hotspot"
              onClick={() => setSelectedProduct(products[0])}
              aria-label="Conhecer Brasa Original"
            >
              <Plus size={25} />
            </button>
          </div>
        </section>
        <div className="brand-strip" aria-label="Nosso jeito de fazer">
          <span>
            <Flame /> GRELHADO NA BRASA
          </span>
          <i />
          <span>
            <Beef /> BLEND DA CASA
          </span>
          <i />
          <span>
            <Leaf /> INGREDIENTES SELECIONADOS
          </span>
          <i />
          <span>
            <ChefHat /> FEITO À MÃO, DE VERDADE
          </span>
        </div>
        <section id="cardapio" className="menu-section section-shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow orange">O DIFÍCIL É ESCOLHER UM SÓ</span>
              <h2>
                Seu próximo
                <br />
                <span>favorito está aqui.</span>
              </h2>
            </div>
            <p>
              Da primeira mordida ao último gole.
              <br />
              Escolha, personalize e deixe o resto com a gente.
            </p>
          </div>
          <div
            className="category-navigation"
            role="tablist"
            aria-label="Categorias do cardápio"
          >
            {categories.map((cat, index) => {
              const Icon = categoryIcons[cat.id];
              return (
                <button
                  key={cat.id}
                  id={`tab-${cat.id}`}
                  role="tab"
                  aria-selected={category === cat.id}
                  aria-controls="product-grid"
                  tabIndex={category === cat.id ? 0 : -1}
                  onClick={() => chooseCategory(cat.id)}
                  onKeyDown={(e) => {
                    let next = index;
                    if (e.key === "ArrowRight")
                      next = (index + 1) % categories.length;
                    else if (e.key === "ArrowLeft")
                      next =
                        (index + categories.length - 1) % categories.length;
                    else if (e.key === "Home") next = 0;
                    else if (e.key === "End") next = categories.length - 1;
                    else return;
                    e.preventDefault();
                    chooseCategory(categories[next].id);
                    document
                      .getElementById(`tab-${categories[next].id}`)
                      ?.focus();
                  }}
                >
                  <Icon size={20} />
                  <span>{cat.name}</span>
                  <small>
                    {products
                      .filter((p) => p.category === cat.id)
                      .length.toString()
                      .padStart(2, "0")}
                  </small>
                </button>
              );
            })}
          </div>
          <div className="category-caption">
            <p>{categories.find((c) => c.id === category)?.subtitle}</p>
            <span>
              {products.filter((p) => p.category === category).length} opções
              feitas com personalidade
            </span>
          </div>
          <div
            className="product-grid"
            id="product-grid"
            role="tabpanel"
            aria-labelledby={`tab-${category}`}
            tabIndex={0}
          >
            {products
              .filter((p) => p.category === category)
              .map((product, index) => (
                <article
                  className="product-card"
                  key={product.id}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <button
                    className="product-photo"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`Ver detalhes de ${product.name}`}
                  >
                    <Image
                      src={imagePath(product)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw"
                    />
                    {product.badge && (
                      <span
                        className={`photo-badge ${product.badge === "Vegetariano" ? "green-badge" : ""}`}
                      >
                        {product.id === "original" && <Flame size={13} />}
                        {product.badge}
                      </span>
                    )}
                    <span className="photo-view">
                      Conhecer <ArrowUpRight size={16} />
                    </span>
                  </button>
                  <div className="product-info">
                    <h3>
                      <button onClick={() => setSelectedProduct(product)}>
                        {product.name}
                      </button>
                    </h3>
                    <p>{product.description}</p>
                    <div className="product-bottom">
                      <strong>{money(product.price)}</strong>
                      <button
                        className="add-button"
                        onClick={() => setSelectedProduct(product)}
                        aria-label={`Adicionar ${product.name}`}
                      >
                        <Plus size={21} />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>
          <p className="menu-footnote">
            <Utensils size={15} /> Seu burger, seu jeito. Escolha os adicionais
            ao fazer o pedido.
          </p>
        </section>
        <section className="about-section" id="sobre">
          <div className="about-photo">
            <Image
              src="/images/cozinha.webp"
              alt="Preparo artesanal em uma cozinha de restaurante"
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <span className="about-photo-text">
              TEMPO, CUIDADO
              <br />E FOGO.
            </span>
          </div>
          <div className="about-copy">
            <span className="eyebrow orange">MUITO ALÉM DE PÃO E CARNE</span>
            <h2>
              A gente acredita
              <br />
              no sabor das
              <br />
              <span>coisas bem feitas.</span>
            </h2>
            <p>
              A Brasa & Ponto nasceu de uma ideia simples: juntar gente em volta
              de comida boa. Daquelas que fazem a conversa parar na primeira
              mordida.
            </p>
            <p>
              Aqui, o blend tem assinatura, o molho tem receita própria e cada
              ingrediente tem um porquê. Nossa história é fictícia. A vontade de
              fazer tudo no ponto, não.
            </p>
            <div className="about-values">
              <span>
                <Flame size={23} /> Fogo de verdade.
              </span>
              <span>
                <Leaf size={23} /> Escolhas com cuidado.
              </span>
            </div>
            <a href="#cardapio" className="about-link">
              Encontre o seu ponto <ArrowUpRight size={20} />
            </a>
          </div>
        </section>
        <section className="contact-section section-shell" id="contato">
          <div>
            <span className="eyebrow orange">A MESA ESTÁ POSTA</span>
            <h2>Chega mais.</h2>
            <p>Tem sempre um bom motivo para pedir Brasa.</p>
          </div>
          <div className="contact-detail">
            <Clock3 size={23} />
            <h3>Quando a brasa acende</h3>
            <p>{restaurant.hours}</p>
            <small>Horário fictício para demonstração.</small>
          </div>
          <div className="contact-detail">
            <MapPin size={23} />
            <h3>Nosso ponto de encontro</h3>
            <p>
              {restaurant.address}
              <br />
              {restaurant.city}
            </p>
            <small>Endereço demonstrativo · não é uma loja real.</small>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <a href="#inicio" aria-label="Voltar ao início">
            <Wordmark footer />
          </a>
          <p>
            Fogo, sabor e personalidade.
            <br />
            Do nosso jeito. No seu ponto.
          </p>
          <a className="footer-back" href="#inicio">
            Voltar ao topo <ArrowUpRight size={19} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Brasa & Ponto</span>
          <span>Marca fictícia. Projeto de portfólio, feito com cuidado.</span>
          <a href="#cardapio">
            Bateu a fome? <ArrowRight size={14} />
          </a>
        </div>
      </footer>
      {count > 0 && (
        <button className="mobile-cart-bar" onClick={() => setCartOpen(true)}>
          <span className="cart-count">{count}</span>
          <span>Ver meu pedido</span>
          <strong>{money(subtotal(cart))}</strong>
          <ArrowRight size={18} />
        </button>
      )}
      {storageWarning && (
        <div className="storage-warning" role="status">
          Seu navegador não permitiu salvar o carrinho. Ele ficará disponível
          enquanto esta página estiver aberta.
          <button
            aria-label="Fechar aviso"
            onClick={() => setStorageWarning(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        <Check size={18} />
        <span>{toast}</span>
        <button
          onClick={() => {
            setToast("");
            setCartOpen(true);
          }}
        >
          Ver pedido <ArrowRight size={15} />
        </button>
      </div>
      <Dialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name ?? "Detalhes do produto"}
      >
        {selectedProduct && (
          <ProductDetail
            key={selectedProduct.id}
            product={selectedProduct}
            onAdd={add}
          />
        )}
      </Dialog>
      <Dialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        title="Seu pedido"
        drawer
      >
        <OrderPanel
          items={cart}
          update={update}
          close={() => setCartOpen(false)}
        />
      </Dialog>
    </>
  );
}
