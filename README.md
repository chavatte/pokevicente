<div align="center">
  <a href="#-english-version">🇺🇸 English</a> | <a href="#-versão-em-português">🇧🇷 Português</a>
</div>

<br>

<div align="center">

# 🎮 PokéVicente v2.5 - Trainer's Hub

<img src="./public/pokevicente_splashscreen.png" alt="PokéVicente - Trainer's Hub" style="margin: 20px;">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor_8-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)

</div>

---

## 🇺🇸 English Version

A hybrid application (Web/Android) built to hunt, battle, and collect Pokémon. Integrated in real-time with PokéAPI and packaged as a native offline-first app.

### 📖 The Project (Overview)

**PokéVicente v2.5** is more than just an app; it's a classic video game experience brought to modern days. It was designed to be a fun and interactive tool where users can guess Pokémon by their silhouettes, collect up to **1025 Pokémon across all 9 generations** in a virtual backpack, bet their coins in a "Top Trumps" arena, and browse a complete encyclopedia.

*   **For gamers:** A complete mobile game that doesn't rely entirely on the internet for its core mechanics. You catch Pokémon, manage your MasterCoins economy, and can save your progress in a secure file so you never lose your collection!
*   **For developers:** A high-performance *Single Page Application* (SPA). It uses state-based conditional rendering for navigation (avoiding complex routing libraries) and caches resources. It is wrapped by the Android *WebView* via Capacitor to generate a native `.apk` without relying on Android Studio.

### ✨ Features

*   🔍 **Who's that Pokémon?:** A silhouette-guessing minigame. Guess correctly on the first try to build a **Combo** and earn bonus **MasterCoins**. Don't know it? Use the "Flee" button to protect your coins!
*   🎒 **Backpack (Local Pokédex):** An offline inventory displaying captured Pokémon across 9 regions, their combat stats, and evolution trees.
*   ⚔️ **Top Trumps (Arena):** A betting battle system against the CPU (AI). It requires MasterCoins to enter; win to multiply your coins, or lose and take the hit!
*   📚 **Poké Wiki:** A global encyclopedia with virtual pagination for querying data via PokéAPI.
*   💾 **Cartridge System (Save State):** Export and import progress via custom `.pkv` files (Base64 encrypted VIP cartridges ensuring local data immutability for your Pokédex and MasterCoins wallet).

### 🛠 Technologies & Architecture

Built with the cutting-edge of the front-end ecosystem:

*   **Core:** React 19 + TypeScript.
*   **Build Tool & Dev Server:** Vite 8 (Ultra-fast, with HMR).
*   **Styling:** Tailwind CSS v4 (Built-in, responsive Design System).
*   **Native Bridge:** Capacitor 8 (Communication bridge between Web and native Android APIs).
*   **Integration:** [PokéAPI](https://pokeapi.co/) consumption via native `fetch`.

### 🚀 How to Run and Build (Step-by-Step)

#### 1. Prerequisites
Ensure you have installed:
*   [Node.js](https://nodejs.org/) (Version 20+)
*   [Yarn](https://yarnpkg.com/) (Package manager)
*   [Java JDK 21](https://learn.microsoft.com/en-us/java/openjdk/download) (Required by Capacitor 8/Gradle)

#### 2. Running in the Browser (Web Mode)
Clone the repository and install dependencies:
```bash
git clone https://github.com/chavatte/pokevicente.git
cd pokevicente
yarn install
```

Start the development server:

Bash

```
yarn dev
```

> The app will be running at `http://localhost:5173`.

#### 3. Building the Native APK (Android)

This project is configured to generate the Android installer locally via the terminal, without the overhead of Android Studio.

**A. Sync Web with Mobile:** Build the production web version and push the static files to the native Android folder:

Bash

```
yarn build
yarn cap sync android
```

**B. Generate Icons and Splash Screens (Optional):** If you modified the master image at `assets/icon.png` or `assets/splash.png`:

Bash

```
yarn capacitor-assets generate --android
```

**C. JDK Setup (Windows):** Ensure Gradle knows where Java 21 is installed. Create a `gradle.properties` file inside the `android/` folder with your JDK path:

Properties

```
org.gradle.java.home=C:/Program Files/Microsoft/jdk-21.0.3.9-hotspot
```

**D. Compile the `.apk`:** Enter the Android folder, clean previous caches, and trigger the build:

Bash

```
cd android
./gradlew clean
./gradlew assembleDebug
```

🎉 **Done!** The installer file will be available at: `android/app/build/outputs/apk/debug/app-debug.apk`

_Technical Note: External image traffic (HTTP/HTTPS) was natively allowed via `android:usesCleartextTraffic="true"` in the `AndroidManifest.xml`._

## 🇧🇷 Versão em Português

Um aplicativo híbrido (Web/Android) desenvolvido para caçar, batalhar e colecionar Pokémons, integrado em tempo real com a PokéAPI e empacotado como um app nativo offline-first.

### 📖 O Projeto (Visão Geral)

O **PokéVicente v2.5** não é apenas um app, é uma experiência de videogame clássico trazida para os dias de hoje. Ele foi desenhado para ser uma ferramenta divertida e interativa, onde o usuário pode adivinhar Pokémons pela silhueta, colecionar até **1025 Pokémons de todas as 9 gerações** em uma mochila virtual, apostar suas moedas em uma arena de "Super Trunfo" e consultar uma enciclopédia completa.

- **Para os jogadores:** É um jogo de celular completo que não precisa de internet para as mecânicas principais, onde você caça Pokémons, gerencia sua economia de MasterCoins e pode salvar seu progresso em um arquivo seguro para nunca perder sua coleção!
    
- **Para os desenvolvedores:** É uma _Single Page Application_ (SPA) de alta performance. Utiliza renderização condicional baseada em estado para navegação (sem bibliotecas complexas de roteamento) e faz o cache de recursos, sendo envelopada pela _WebView_ do Android via Capacitor para gerar um `.apk` nativo sem depender do Android Studio.
    

### ✨ Funcionalidades

- 🔍 **Quem é esse Pokémon?:** Minigame de adivinhação. Acerte de primeira para criar um **Combo** e multiplicar suas **MasterCoins**. Não sabe qual é? Use o botão "Fugir" para proteger suas moedas (mas perder o combo).
    
- 🎒 **Mochila (Pokédex Local):** Um inventário offline que exibe os Pokémons capturados através das 9 regiões, suas estatísticas de combate e árvores de evolução.
    
- ⚔️ **Super Trunfo (Arena):** Sistema de batalha com apostas contra a CPU. Exige MasterCoins para participar; vença para lucrar, ou perca e sofra o prejuízo financeiro!
    
- 📚 **Poké Wiki:** Enciclopédia global com paginação virtual para consulta de dados via PokéAPI.
    
- 💾 **Sistema de Cartucho (Save State):** Exportação e importação de progresso via arquivos exclusivos `.pkv` (Cartuchos VIP ofuscados em Base64, garantindo imutabilidade de dados local da sua Mochila e carteira de MasterCoins).
    

### 🛠 Tecnologias e Arquitetura

O projeto foi construído com o que há de mais moderno no ecossistema front-end:

- **Core:** React 19 + TypeScript.
    
- **Build Tool & Dev Server:** Vite 8 (Ultra-rápido, com Hot Module Replacement).
    
- **Estilização:** Tailwind CSS v4 (Design System embutido e responsivo).
    
- **Bridge Nativa:** Capacitor 8 (Ponte de comunicação entre a Web e a API nativa do Android).
    
- **Integração:** Consumo da [PokéAPI](https://pokeapi.co/) via `fetch` nativo.
    

### 🚀 Como Rodar e Compilar (Guia Passo a Passo)

#### 1. Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (Versão 20+)
    
- [Yarn](https://yarnpkg.com/) (Gerenciador de pacotes)
    
- [Java JDK 21](https://learn.microsoft.com/pt-br/java/openjdk/download) (Exigido pelo Capacitor 8/Gradle)
    

#### 2. Rodando no Navegador (Modo Web)

Clone o repositório e instale as dependências:

Bash

```
git clone https://github.com/chavatte/pokevicente.git
cd pokevicente
yarn install
```

Inicie o servidor de desenvolvimento:

Bash

```
yarn dev
```

> O app estará rodando em `http://localhost:5173`.

#### 3. Compilando o APK Nativo (Android)

Este projeto foi configurado para gerar o instalador do Android localmente pelo terminal (PowerShell/Bash), sem precisar do peso do Android Studio.

**A. Sincronize a Web com o Mobile:** Primeiro, compile a versão web de produção e envie os arquivos estáticos (HTML/CSS/JS) para a pasta nativa do Android:

Bash

```
yarn build
yarn cap sync android
```

**B. Gere os Ícones e Splash Screens (Opcional):** Caso tenha alterado a imagem mestre em `assets/icon.png` ou `assets/splash.png`:

Bash

```
yarn capacitor-assets generate --android
```

**C. Ajuste do JDK (Windows):** Garanta que o Gradle saiba onde o Java 21 está instalado. Crie um arquivo `gradle.properties` dentro da pasta `android/` com o caminho da sua instalação do JDK:

Properties

```
org.gradle.java.home=C:/Program Files/Microsoft/jdk-21.0.3.9-hotspot
```

**D. Compile o `.apk`:** Entre na pasta do Android, limpe os caches de tentativas anteriores e dispare a compilação:

Bash

```
cd android
./gradlew clean
./gradlew assembleDebug
```

🎉 **Pronto!** O arquivo instalável estará disponível no diretório: `android/app/build/outputs/apk/debug/app-debug.apk`

_Nota Técnica: O tráfego de imagens externas (HTTP/HTTPS) foi liberado nativamente via `android:usesCleartextTraffic="true"` no `AndroidManifest.xml`._

## 👨‍💻 Author / Autor

Developed with ☕ and code by **DevChavatte**. / Desenvolvido com ☕ e muito código por **DevChavatte**.