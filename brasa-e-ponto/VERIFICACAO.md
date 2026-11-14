# Verificação da entrega

- ESLint: aprovado, sem avisos.
- TypeScript: aprovado, com geração de tipos do Next.js.
- Build: exportação estática do Next.js aprovada.
- Testes: 9 testes aprovados (8 de domínio + 1 fluxo integrado da interface).
- Os 16 produtos podem ser personalizados, calculados e recuperados do armazenamento nos testes.
- O fluxo integrado testa as quatro categorias, adicionais, observações, quantidade, persistência após remontagem, totais, validação, retirada, dinheiro/troco, prévia, cópia e remoção até o estado vazio.
- Fontes e imagens locais; referências de imagens verificadas no pacote estático.

## Limite da verificação

O ambiente não disponibilizou a ferramenta de navegador exigida pelo Sites. Portanto, não foi possível executar revisão visual real em desktop/mobile, testar o foco nativo do `<dialog>` em um navegador, ou abrir WhatsApp externamente. Os testes de interface usam JSDOM e simulam apenas o comportamento da API de diálogo e da área de transferência. A integração do WhatsApp é testada pela geração e decodificação da URL, com número de teste não enviado.

O layout contém breakpoints para celular, tablet e desktop e considera telas de 320 px. Antes de apresentar em um dispositivo específico, conferir os tamanhos 320, 375, 768 e 1440 px, rolagem dos modais, Escape/Tab e cópia em HTTPS. Nenhum pedido real foi enviado.
