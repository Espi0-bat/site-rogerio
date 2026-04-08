# Manual de Uso e Manutenção
**Projeto:** Landing Page Premium — Dr. Rogério Furtado
**Tecnologia:** HTML5, CSS3, e JavaScript Vanilla (Sem frameworks, alto desempenho).

Este documento serve como um guia rápido para a equipe responsável por hospedar e dar manutenção básica ao site.

---

## 1. Estrutura do Projeto
O site não utiliza bancos de dados ou construtores de arrastar-e-soltar (como Wordpress). É um site estático focado em velocidade extrema.
Você receberá os seguintes itens:
- `index.html`: O arquivo principal do site. Ele contém todos os textos, links e a estrutura da página.
- `assets/`: Pasta contendo todas as imagens corporativas, ícones e vídeos de fundo.
- `css/`: Pasta contendo toda a estilização, cores e design responsivo.
- `js/`: Pasta contendo a inteligência de animações, rolagem suave e menu mobile.

---

## 2. Como colocar o site no ar?
Como o site é 100% estático, ele pode ser hospedado de forma extremamente barata ou até gratuita.
- **Hospedagem Tradicional (HostGator, Hostinger, Locaweb, etc.):** Faça o upload de todos os arquivos (`index.html` e as três pastas) diretamente via painel FTP ou Gerenciador de Arquivos para a pasta raiz principal (geralmente chamada de `public_html`).
- **Hospedagem Moderna Nuvem (Vercel, Netlify, GitHub Pages):** Basta arrastar a pasta do projeto diretamente para o painel dessas ferramentas e elas colocarão o site no ar instantaneamente em infraestrutura global.

---

## 3. Como alterar o número do WhatsApp?
Se a clínica trocar de número, basta atualizar o link que faz o redirecionamento.
1. Abra o arquivo `index.html` usando um editor básico de código (como Bloco de Notas ou VS Code).
2. Pressione `CTRL + F` e busque por `wa.me/5561998338898`.
3. Você encontrará links parecidos com este: `href="https://wa.me/5561998338898?text=Olá..."`.
4. Basta alterar o número `5561998338898` para o novo número (sempre mantendo o "55" do Brasil e o DDD).
5. Salve o arquivo.

---

## 4. Substituição de Imagens e Compressão (Aviso Importante)
O layout do site foi construído sobre belas imagens do Dr. Rogério. Para alterar qualquer imagem, a forma mais fácil e que **não requer alterar nenhum código** é:
1. Vá até a pasta `assets/`.
2. Delete a foto atual (ex: `foto_da_fachada.jpeg`).
3. Cole a sua nova foto na pasta e **renomeie-a exatamente igual à antiga** (inclusive a extensão `.jpeg` ou `.jpg`).

### ⚠️ Regra de Ouro (Compressão)
Antes de colocar imagens e vídeos em produção (no ar), recomendamos fortemente o uso de ferramentas de compressão gratuitas como o **TinyPNG.com** e o **FreeConvert.com (para vídeos)**. O uso de arquivos de imagem cruas (acima de 1MB) pode penalizar drasticamente o carregamento do site no celular de pacientes que estão em conexões 3G.

---

## 5. Substituindo a foto de "Antes e Depois"
Dentro do site, existe uma seção com um "Slider" interativo para demonstrar o Antes e Depois da Catarata.
Atualmente, usamos a foto `foto teste.jpeg` que está dentro da pasta `assets/`.
Para colocar um caso clínico real:
1. Obtenha a foto real (antes e depois do paciente) garantindo o formulário de autorização ética.
2. Substitua o arquivo `foto teste.jpeg` por sua nova foto e mantenha o mesmo nome, OU altere o nome no código `index.html` (busque por `foto teste.jpeg` e mude as duas ocorrências que encontrar).

---

## 6. Alterações em Textos Gerais
Para atualizar endereços, trocar textos do Doutor ou descrições:
1. Abra o `index.html` num editor de código (Nunca use o Microsoft Word).
2. Aperte `CTRL + F` (buscar) e digite a frase que você quer mudar (por exemplo: "Avaliação Individual").
3. Digite por cima da frase o seu novo texto.
4. Salve o arquivo e limpe o cache do servidor/navegador.

---
*Em caso de implementações complexas (novas áreas, novos planos ou integrações dinâmicas), recomenda-se contatar o desenvolvedor original que planejou e componentizou a estrutura profissional.*
