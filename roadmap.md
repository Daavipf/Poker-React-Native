### Fase 1: O Motor de Regras (Foco total no `gameReducer`)

Seu objetivo aqui é ter um `reducer` que conheça **todas as regras** do poker, mesmo que nada o esteja "chamando" ainda.

1.  ✅ **Ações de Aposta: `RAISE` e `CALL`**

    - **`RAISE`:** É a mais complexa. Implemente-a primeiro. Ela precisa:
      - Atualizar o `betNaRodada` do jogador.
      - Subtrair `chips` do jogador.
      - Adicionar ao `pot`.
      - Definir o `apostaAtual` (a nova "aposta" a ser paga).
      - **Definir o `indiceUltimoARaise`** para o `indiceJogadorAtivo` atual. (Esta é a "âncora" que discutimos).
    - **`CALL`:** Agora implemente o `CALL`, usando a lógica que detalhamos (calcular a diferença, lidar com all-in, atualizar `chips` e `pot`).
    - **`CHECK`:** É um "caso especial" de `CALL`. Você pode tratá-lo como um `CALL` onde a diferença (`apostaAtual - jogador.betNaRodada`) é zero. Se a diferença for zero, a ação é permitida (é um `CHECK`). Se for maior que zero, a ação `CHECK` é inválida.

2.  ✅ **Lógica de Fim de Rodada**

    - Esta não é uma ação separada, mas sim uma **verificação no final** de `CALL`, `CHECK` e `FOLD`.
    - Após qualquer uma dessas ações, encontre o `proximoIndice` (o próximo jogador que _pode_ agir).
    - **Implemente a verificação principal:** `if (proximoIndice === state.indiceUltimoARaise)`.
    - Se for `true`, a rodada de apostas acabou. Chame sua lógica `AVANCAR_FASE` (que você já tem!).

3.  ✅ **Lógica de "Último Sobrevivente"**
    - Dentro da sua ação `FOLD`, após marcar o jogador como `saiu = true`, adicione esta verificação:
    - Conte quantos jogadores ainda têm `saiu === false`.
    - Se `count === 1`, a **mão inteira** terminou.
    - Neste ponto, você não avança a fase. Você precisa de uma nova lógica (ex: `case 'DISTRIBUIR_POTE'`) que dá o pote ao vencedor e depois chama `INICIAR_RODA`.

**PONTO DE PARADA 1:** Neste ponto, você tem um `reducer` que pode, em teoria, rodar um jogo inteiro (sem IA ou UI). Você pode testá-lo manualmente.

---

### Fase 2: O Juiz (Lógica de Vencedor)

Ainda estamos na lógica de negócios, fora do React.

4.  ✅ **Avaliador de Mãos (O "Juiz")**

    - Crie uma função _externa_ (ex: `HandEvaluator.js`).
    - Esta função terá uma única responsabilidade: receber 7 cartas (5 da mesa + 2 do jogador) e retornar a melhor mão de 5 cartas possível (ex: `{ rank: 'FLUSH', highCard: 'K' }`).
    - Esta é a parte mais complexa em termos de algoritmos de poker. Foque nela isoladamente.

5.  **Lógica de `SHOWDOWN`**

    - Agora, no seu `gameReducer`, no `case 'AVANCAR_FASE'`, quando você for do `RIVER` para o `SHOWDOWN`:
    - Chame seu `HandEvaluator` para _cada_ jogador que ainda está na mão (`!saiu`).
    - Compare os resultados para encontrar o(s) vencedor(es).

6.  **Distribuição de Pote**
    - Implemente a lógica que pega o(s) vencedor(es) do `SHOWDOWN` (ou o "Último Sobrevivente" do FOLD) e adiciona o `state.pot` aos `chips` dele(s).
    - _Simplificação V1:_ Esqueça potes paralelos (side-pots) por agora. Apenas dê o pote principal ao melhor.
    - Após distribuir, chame sua lógica de `INICIAR_RODA` para recomeçar.

**PONTO DE PARADA 2:** Seu `reducer` agora está 99% completo. Ele sabe jogar, sabe quem ganha e sabe como recomeçar.

---

### Fase 3: O Orquestrador e a IA (O `useGame` Hook)

Agora, e só agora, você volta para o React.

7.  **O Orquestrador `useGame`**

    - Crie seu `useGame` hook, que usa o `gameReducer` (que você acabou de completar).
    - Adicione o `useEffect` que "assiste" o `estado`, especificamente `estado.indiceJogadorAtivo`.
    - Dentro do `useEffect`, verifique o jogador atual: `const jogador = estado.jogadores[estado.indiceJogadorAtivo]`.

8.  **O Loop da IA**
    - **Se `jogador.isHuman === true`:** O `useEffect` não faz nada. O jogo espera o dispatch do front-end.
    - **Se `jogador.isHuman === false` (é uma IA):**
      - É aqui que o `useEffect` chama sua função de decisão de IA.
      - `const acao = AILogic.decidirAcao(estado);`
      - (Opcional: adicione um `setTimeout` de 1 segundo aqui para simular "pensamento".)
      - `dispatch(acao);`
    - Isso cria o loop: a IA age -> o reducer processa -> o estado muda -> o `useEffect` dispara -> é a vez da próxima IA (ou humano).

**PONTO DE PARADA 3:** Seu jogo agora funciona 100% na lógica. Você poderia "jogar" ele apenas olhando os `console.log` do estado.

---

### Fase 4: A Pintura (Front-End)

Agora é a parte fácil e divertida.

9.  **Conectar o Front-End**
    - No seu componente `Game.js`, finalmente chame `const { estado, dispatch } = useGame();`.
    - Renderize os dados: `estado.pot`, `estado.cartasComunitarias`, `estado.jogadores.map(...)`.
    - Adicione os botões de ação (`FOLD`, `CALL`, `RAISE`).
    - No `onPress`, eles simplesmente chamam `dispatch({ type: 'ACAO_JOGADOR', payload: { ... } })`.
    - **Ocultar botões:** Mostre os botões de ação _apenas se_ `estado.jogadores[estado.indiceJogadorAtivo].isHuman === true`.

---

### Resumo do Plano

1.  **Fase 1 (Reducer):** Ações (`RAISE`, `CALL`), Fim da Rodada, "Último Sobrevivente".
2.  **Fase 2 (Juiz):** Avaliador de Mãos, `SHOWDOWN`, Distribuição do Pote.
3.  **Fase 3 (Hook):** `useEffect` orquestrador, loop da IA.
4.  **Fase 4 (UI):** Conectar os botões e mostrar o estado.
