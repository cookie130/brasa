# Brasa & Ponto

Hamburgueria fictícia com cardápio e fluxo de pedidos funcional. Next.js App Router, TypeScript, Tailwind CSS 4 e Lucide React. Sem banco de dados, sem cobrança e sem número real de WhatsApp configurado.

## Executar localmente

Requisitos: Node.js 24 LTS (24.15.0 ou superior na série 24) e npm.

```bash
npm ci
npm run dev
```

Acesse http://localhost:3000. Para validar:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

A aplicação usa exportação estática. O build gera `out/`, pronto para hospedagem estática. Para testar esse build localmente, execute `npx serve out`. `next start` não é compatível com `output: 'export'`; prefira `npm run preview`.

## Onde personalizar

| Conteúdo                                           | Arquivo                                           |
| -------------------------------------------------- | ------------------------------------------------- |
| Produtos, categorias, descrições e preços          | `lib/menu.ts`                                     |
| Adicionais, preços e produtos compatíveis          | `extras` e `extraIds` em `lib/menu.ts`            |
| Taxa de entrega, nome, horário e endereço          | `lib/config.ts`                                   |
| Número do WhatsApp                                 | `restaurant.whatsappNumber` em `lib/config.ts`    |
| Fotografias WebP                                   | `public/images/` e campo `image` em `lib/menu.ts` |
| Cores, tipografia e layout responsivo              | `app/globals.css`                                 |
| Metadados e URL canônica usada nas imagens sociais | `app/layout.tsx`                                  |
| Favicon                                            | `app/icon.svg`                                    |
| Textos editoriais                                  | `components/storefront.tsx`                       |

**Todos os preços estão em centavos**: `3290` representa R$ 32,90. A taxa inicial é `600`, ou R$ 6,00. As imagens são locais e otimizadas em WebP. As fontes também são locais.

O WhatsApp deve conter código do país, DDD e número, somente dígitos. Deixe `whatsappNumber: ''` para manter o modo demonstrativo. Neste modo, o checkout exibe a mensagem e permite copiá-la, sem abrir conversa ou enviar pedido. Quando um número autorizado estiver configurado, a revisão final mostrará o botão **Finalizar pelo WhatsApp**. A conversa abre em outra aba e o usuário confirma o envio no WhatsApp.

A taxa e o prazo são demonstrativos; não há cálculo de rota, disponibilidade, estoque ou integração de pagamento. As fotografias são ilustrativas de uma marca fictícia. O endereço não corresponde a uma loja real. Nenhum perfil social ou contato de terceiros foi inventado.

## Arquitetura

- `lib/menu.ts`, `lib/config.ts`: dados e configuração.
- `lib/order.ts`: funções puras de cálculo, personalização, recuperação do carrinho, validação e mensagem.
- `components/storefront.tsx`: página editorial, filtros, navegação e estado do carrinho.
- `components/product-detail.tsx`: seleção de adicionais, observações e quantidade.
- `components/order-panel.tsx`: carrinho, checkout, revisão e cópia/WhatsApp.
- `components/dialog.tsx`: diálogo nativo com foco modal, fechamento com Escape e restauração de foco; controle reutilizável de quantidade.
- `tests/order.test.ts`: oito testes de domínio, incluindo os 16 produtos, centavos, personalizações e dados corrompidos.
- `tests/ui.test.tsx`: fluxo integrado em DOM simulado, da categoria à cópia, com remontagem para verificar a persistência.

O carrinho usa `brasa-e-ponto:cart:v1` no localStorage. Somente produto, adicionais, observações e quantidade são persistidos. Nome, telefone e endereço permanecem em memória durante o checkout. Preços são sempre reconstituídos pelo catálogo, nunca aceitos do armazenamento. Falhas de armazenamento exibem um aviso e o pedido continua em memória.

## Acessibilidade e responsividade

A navegação de categorias usa setas, Home e End. Modais usam `<dialog>`, foco nativo e Escape. Botões têm nomes acessíveis, formulário associa erros aos campos e foca o primeiro erro. O layout tem regras para celular, tablet e desktop; animações respeitam `prefers-reduced-motion`. A revisão visual em navegador real não foi possível no ambiente de execução: o teste de interface usa JSDOM e não substitui a validação visual em dispositivos reais.

## Publicação e manutenção

`.openai/hosting.json` contém a identidade da publicação no Sites. Para uma cópia independente em outro provedor, mantenha `out/` como diretório publicado e configure a sua própria URL em `app/layout.tsx`. Para uma nova publicação no Sites, não reutilize a identidade do projeto original.

Veja `CREDITS.md` para as fontes visuais. Após modificar preços ou produtos, execute as verificações acima e gere um novo build.
