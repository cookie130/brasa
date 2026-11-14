export const categories = [
  {
    id: "burgers",
    name: "Burgers",
    subtitle: "Na brasa. No ponto. Do seu jeito.",
  },
  {
    id: "sides",
    name: "Acompanhamentos",
    subtitle: "Porque coisa boa pede companhia.",
  },
  {
    id: "drinks",
    name: "Bebidas",
    subtitle: "Um gole fresco entre uma mordida e outra.",
  },
  {
    id: "desserts",
    name: "Sobremesas",
    subtitle: "O último pedido sempre pode ser doce.",
  },
] as const;
export type Category = (typeof categories)[number]["id"];
export type Extra = { id: string; name: string; price: number };
export const extras: Extra[] = [
  { id: "cheddar", name: "Cheddar extra", price: 400 },
  { id: "bacon", name: "Bacon crocante", price: 600 },
  { id: "carne", name: "Blend da casa · 160 g", price: 1200 },
  { id: "molho", name: "Maionese da casa", price: 250 },
  { id: "calda", name: "Calda de chocolate", price: 300 },
];
export type Product = {
  id: string;
  category: Category;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  extraIds: string[];
};
export const products: Product[] = [
  {
    id: "original",
    category: "burgers",
    name: "Brasa Original",
    description:
      "Blend de 160 g, cheddar, alface, tomate e maionese da casa no brioche tostado.",
    price: 3290,
    image: "original",
    badge: "O favorito da casa",
    extraIds: ["cheddar", "bacon", "carne", "molho"],
  },
  {
    id: "duplo",
    category: "burgers",
    name: "Duplo Fogo",
    description:
      "Dois blends de 160 g, cheddar em dobro, cebola caramelizada e molho defumado.",
    price: 4290,
    image: "duplo",
    badge: "Para muita fome",
    extraIds: ["cheddar", "bacon", "carne", "molho"],
  },
  {
    id: "smash",
    category: "burgers",
    name: "Smash da Casa",
    description:
      "Dois smash de 80 g, queijo prato, picles e nosso molho especial no pão macio.",
    price: 2990,
    image: "smash",
    extraIds: ["cheddar", "bacon", "carne", "molho"],
  },
  {
    id: "bacon",
    category: "burgers",
    name: "Bacon & Brasa",
    description:
      "Blend de 160 g, bacon crocante, cheddar e barbecue artesanal no brioche.",
    price: 3990,
    image: "bacon",
    badge: "Defumado no ponto",
    extraIds: ["cheddar", "bacon", "carne", "molho"],
  },
  {
    id: "verde",
    category: "burgers",
    name: "Ponto Verde",
    description:
      "Burger de grão-de-bico, rúcula, tomate, cebola roxa e maionese de ervas.",
    price: 3490,
    image: "verde",
    badge: "Vegetariano",
    extraIds: ["cheddar", "molho"],
  },
  {
    id: "frango",
    category: "burgers",
    name: "Crocante da Vila",
    description:
      "Frango empanado, coleslaw fresco, picles e maionese de páprica no brioche.",
    price: 3290,
    image: "frango",
    extraIds: ["cheddar", "bacon", "molho"],
  },
  {
    id: "batatas",
    category: "sides",
    name: "Batatas da Brasa",
    description:
      "Batatas rústicas douradas, alecrim e flor de sal. Acompanha maionese da casa. 250 g.",
    price: 1890,
    image: "batatas",
    badge: "Par perfeito",
    extraIds: ["cheddar", "bacon", "molho"],
  },
  {
    id: "fritas",
    category: "sides",
    name: "Fritas Sem Cerimônia",
    description:
      "Fritas fininhas, crocantes e temperadas com páprica defumada. Porção de 250 g.",
    price: 2290,
    image: "batatas",
    extraIds: ["cheddar", "bacon", "molho"],
  },
  {
    id: "onion",
    category: "sides",
    name: "Anéis Dourados",
    description:
      "Anéis de cebola empanados e sequinhos, com molho barbecue artesanal. 200 g.",
    price: 2190,
    image: "onion",
    extraIds: ["molho"],
  },
  {
    id: "cola",
    category: "drinks",
    name: "Refrigerante Cola",
    description:
      "Cola tradicional bem gelada, para acompanhar o seu burger. Lata de 350 ml.",
    price: 700,
    image: "cola",
    extraIds: [],
  },
  {
    id: "limonada",
    category: "drinks",
    name: "Cítricos da Vila",
    description:
      "Drink sem álcool de limão e laranja, gelo e uma borda de sal. Refrescante na medida. 400 ml.",
    price: 1200,
    image: "limonada",
    badge: "Feita na hora",
    extraIds: [],
  },
  {
    id: "suco",
    category: "drinks",
    name: "Laranja de Verdade",
    description:
      "Suco de laranja natural, sem açúcar adicionado. Sol em forma de gole. 400 ml.",
    price: 1200,
    image: "suco",
    extraIds: [],
  },
  {
    id: "agua",
    category: "drinks",
    name: "Água Mineral",
    description:
      "Água mineral sem gás, bem gelada. Garrafa de 500 ml.",
    price: 600,
    image: "agua",
    extraIds: [],
  },
  {
    id: "brownie",
    category: "desserts",
    name: "Brownie do Ponto",
    description:
      "Chocolate intenso, casquinha fina e miolo úmido. Feito na casa, servido morno.",
    price: 1690,
    image: "brownie",
    badge: "Final feliz",
    extraIds: ["calda"],
  },
  {
    id: "cookie",
    category: "desserts",
    name: "Cookie Abraço",
    description:
      "Cookie de manteiga dourada com pedaços generosos de chocolate meio amargo.",
    price: 1090,
    image: "cookie",
    extraIds: ["calda"],
  },
  {
    id: "sorvete",
    category: "desserts",
    name: "Shake do Ponto",
    description:
      "Sorvete de baunilha batido com leite, calda de chocolate, chantilly e biscoito. 400 ml.",
    price: 1490,
    image: "sorvete",
    extraIds: ["calda"],
  },
];
export const imagePath = (product: Product) => `/images/${product.image}.webp`;
