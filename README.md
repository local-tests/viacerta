# Site Via Certa Internet — v2

Site de uma página em HTML, CSS e JavaScript puros. Não tem build nem dependências, então funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Hostinger…).

```
index.html              página completa (conteúdo, SEO e dados estruturados)
assets/css/style.css    visual (cores no topo, em :root)
assets/js/config.js     ← links e contatos (edite aqui)
assets/js/main.js       comportamento (menu, carrosséis, formulários, avaliações)
assets/fonts/           fontes Sora e Manrope hospedadas no próprio site
assets/img/             logos (WebP + PNG), símbolo, ícones, imagem de compartilhamento
robots.txt              libera buscadores e assistentes de IA
sitemap.xml             mapa do site (trocar SEU-DOMINIO)
llms.txt                resumo da empresa para IAs (ChatGPT, Claude, Perplexity…)
site.webmanifest        ícone e cor ao salvar o site na tela do celular
brand/                  logos originais enviados pelo cliente (não são usados pelo site)
.nojekyll               faz o GitHub Pages servir os arquivos como estão
```

## Ver localmente

```bash
python -m http.server 5500
```

Depois é só abrir http://localhost:5500.

## Subir no GitHub

**Pelo terminal**, dentro desta pasta, depois de criar um repositório vazio no GitHub (sem README):

```bash
git init -b main
git add .
git commit -m "Site Via Certa Internet v2"
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

O `.gitignore` já deixa de fora a pasta `.claude` (configuração local) e os arquivos de sistema.

**Pelo site do GitHub** ("Add file › Upload files"): arraste tudo, **menos** a pasta `.claude`. Os arquivos que começam com ponto (`.gitignore`, `.gitattributes`, `.nojekyll`) podem ficar ocultos no Windows. Se não aparecerem, crie um arquivo vazio chamado `.nojekyll` direto no GitHub.

**Publicar com o GitHub Pages:** no repositório, abra Settings › Pages › Build and deployment, escolha "Deploy from a branch", depois `main` e `/ (root)`. O site fica em `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`. Para usar o domínio próprio, preencha "Custom domain" na mesma tela.

> Se o repositório for público, tudo o que estiver no `config.js` fica visível. Isso é normal para a chave da API do Google, porque ela vai para o navegador de qualquer jeito, mas ela **precisa** estar restrita ao domínio do site no Google Cloud.

## Links (`assets/js/config.js`)

Já estão preenchidos com os links da página oficial de contatos da empresa (bit.ly/m/contatos-viacertadigital):

- Área do Assinante: `sac.bitcom.com.br`
- App: aparece como **Bitcom** na Google Play e na App Store
- Instagram, Facebook e TikTok: @viacertadigital

Se um campo ficar vazio, o botão dele some sozinho. A 2ª via usa a Área do Assinante; se ela também estiver vazia, abre o WhatsApp.

Planos e preços estão direto no `index.html` (seção `PLANOS`), no FAQ e no JSON-LD do `<head>`. **Ao mudar um preço, atualize os três lugares e também o `llms.txt`.**

## Avaliações do Google

- **Hoje:** a nota (5,0), o total (86) e 6 trechos reais do perfil do Google estão escritos no HTML. Assim, o Google e as IAs conseguem ler o conteúdo sem executar JavaScript.
- **Ao vivo (opcional):** preencha `placeId` e `apiKey` no `config.js`. É preciso ativar a Maps JavaScript API e a Places API (New) no Google Cloud e restringir a chave ao domínio. A nota, o total e até 5 avaliações passam a vir do Google automaticamente.

## SEO, AEO, GEO e schema: o que já está no site

**SEO (Google)**
- Título e descrição com as palavras-chave principais: *internet fibra Nova Araçá e Paraí*.
- O H1 começa com "Internet fibra em Nova Araçá e Paraí". Os H2 de planos, cobertura, sobre e FAQ repetem as cidades de forma natural, sem exagero.
- Seção "Sobre" com um texto que define a empresa e um quadro "Em resumo" com os fatos principais e a data de atualização.
- Metas de localização (`geo.*`), Open Graph para WhatsApp e Facebook, imagens com tamanho declarado e textos alternativos.

**Dados estruturados (JSON-LD em `@graph`)**
- `LocalBusiness`, ligado ao conceito de provedor de internet no Wikidata (Q11371). Inclui CNPJ, data de fundação (26/03/2009, conforme a Receita), endereço, coordenadas, horários, telefones de vendas, suporte e financeiro, e as redes sociais.
- `areaServed`: Nova Araçá e Paraí, ligadas ao Wikidata e à Wikipedia.
- `Service` + `OfferCatalog` com os 3 planos (preço mensal em BRL).
- `FAQPage` com as 11 perguntas, idênticas ao texto visível.
- `WebSite` e `WebPage` com `dateModified`.
- **Sem `aggregateRating`, de propósito:** as regras do Google proíbem marcar no schema as notas vindas do próprio Google, e isso pode gerar penalidade. A nota aparece só no texto visível.

**AEO (respostas diretas) e GEO (assistentes de IA)**
- O FAQ responde perguntas reais ("Tem internet fibra em Paraí?", "Quanto custa…?"). A primeira frase de cada resposta já é a resposta, o formato que Google, ChatGPT e Perplexity costumam citar.
- Fatos verificáveis e datados (preços, nota, endereço, CNPJ, "desde 2009") em texto simples, sem depender de JavaScript.
- `llms.txt` com o resumo da empresa e `robots.txt` liberando GPTBot, ClaudeBot, PerplexityBot e Google-Extended.

## Otimizações para celular

- Na primeira tela do celular aparecem título, preço inicial, "Ver planos", "Já sou cliente", a nota do Google e os 6 atalhos.
- Barra fixa embaixo (Planos, 2ª via, Assinante, WhatsApp), que some enquanto a pessoa digita para não cobrir o campo.
- Planos em carrossel, com o plano Ideal no centro e um seletor 350/700/1000 Mega.
- Benefícios, atendimento e FAQ em formato compacto. O mockup do app sai no celular e ficam os botões das lojas.
- O mapa do Google aparece direto, com carregamento preguiçoso (`loading="lazy"`): os cerca de 280 KB dele só são baixados quando a pessoa rola até a seção da loja, sem pesar na abertura do site.
- Carregamento inicial de cerca de 60 KB (fontes locais com preload e logo em WebP). O símbolo grande do topo nem é baixado no celular.
- Áreas de toque com pelo menos 44px, campos de 16px (evita o zoom automático do iPhone), teclado numérico nos telefones e suporte ao notch do iPhone.
- O formulário mostra um botão "Abrir o WhatsApp" de reserva, caso o navegador bloqueie a abertura automática.

## Pendências para confirmar com o cliente

1. **Domínio.** Com ele definido (ou com o endereço do GitHub Pages): descomentar o `canonical` e o `og:url` no `<head>`, trocar `SEU-DOMINIO` no `robots.txt` e no `sitemap.xml`, e usar uma URL absoluta no `og:image`.
2. **Planos e preços** vieram do esboço do cliente. Falta confirmar o que o Ultra tem a mais que o Ideal.
3. **Regras do Indique e ganhe.**
4. **Horário de segunda-feira.** O Google mostrava feriado, então foi usado o mesmo horário de terça a sexta.
5. **"Desde 2009"** usa a data de abertura do CNPJ. Confirmar se o cliente quer destacar isso.

## Fora do site (onde está o maior ganho de SEO local)

1. **Google Search Console e Bing Webmaster Tools:** cadastrar o domínio e enviar o `sitemap.xml`. O Bing também alimenta o ChatGPT e o Copilot.
2. **Perfil da Empresa no Google:**
   - trocar o site (hoje é um bit.ly que leva para bitcom.com.br) pelo domínio novo;
   - corrigir o endereço para "Gazzoni" (a Receita usa "Gazzoni", o Google mostra "Gazoni");
   - adicionar Paraí como área atendida;
   - cadastrar os 3 planos como produtos;
   - publicar novidades e fotos com frequência;
   - continuar respondendo todas as avaliações.
3. **Nome igual em todos os lugares:** hoje aparecem "Viacerta Bitcom", "Via Certa Digital" e "Via Certa Internet". Escolher um nome e usar igual no Google, nas redes e no site ajuda o Google e as IAs a entenderem que é a mesma empresa.
4. **Citações locais:** Apple Business Connect (Apple Maps), Bing Places e o link do site na bio do Instagram, Facebook e TikTok.
5. **Avaliações:** pedir avaliação a todo cliente instalado (sem oferecer brinde, que é proibido pelo Google). Avaliações que citam "fibra" e a cidade ajudam.
6. **Próximo passo de conteúdo:** criar páginas próprias para `/internet-nova-araca` e `/internet-parai`. Isso ajuda a ranquear "internet Paraí", já que a loja fica em Nova Araçá.
