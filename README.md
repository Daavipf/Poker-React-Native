# ♠️ Poker AI - React Native Project

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

Um aplicativo de Poker (Texas Hold'em) multiplataforma desenvolvido com **React Native**, focado em uma interface minimalista e oponentes controlados por uma Inteligência Artificial com lógica de decisão avançada.

## 📋 Sobre o Projeto

Este projeto visa criar uma experiência de poker fluida e estrategicamente desafiadora. Diferente de jogos casuais, o foco aqui está na implementação de uma **IA capaz de tomar decisões** baseadas em cálculos de equidade e força da mão.

O sistema é construído inteiramente em **TypeScript**, garantindo tipagem forte desde a lógica de jogo no frontend até a persistência de dados no backend.

## 🚀 Tecnologias Utilizadas

### Mobile (Frontend)

- **React Native:** Framework principal para desenvolvimento mobile.
- **TypeScript:** Linguagem padrão do projeto.
- **UI/UX:** Design System próprio focado em minimalismo.

### Lógica & IA

- **Algoritmos de Decisão:** Lógica personalizada para NPCs (Fold, Call, Raise).
- **Fórmula de Chen:** Implementação matemática para avaliação inicial de força das mãos (starting hand strength).

### Testes Automatizados

- **Jest:** Framework de testes (Unitários e Integração).

## ✨ Funcionalidades Principais

- [x] **Motor de Jogo:** Lógica completa de Texas Hold'em (rodadas de aposta, blind, dealer).
- [x] **Avaliação de Mãos:** Algoritmo para calcular o vencedor do pote.
- [x] **IA Básica:** Bots que utilizam a Fórmula de Chen para decidir a entrada na mão.
- [ ] **IA Avançada:** Lógica de blefe e adaptação ao estilo do jogador (Em desenvolvimento).

## 📂 Estrutura do Projeto

```bash
/
├── app/             # Aplicação React Native
│   ├── components/ # Componentes visuais (Cartas, Chips, Mesa)
│   ├── engine/      # Lógica pura (Chen Formula, Hand Evaluator)
│   ├── hooks/      # Hook personalizado para orquestrar a lógica do jogo
│   ├── types/      # Tipos e interfaces para tipagem estática
│   └── app/    # Telas (Game, Menu, Settings)
│
```
