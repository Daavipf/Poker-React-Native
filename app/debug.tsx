import Button from "@/components/Button"
import useGame from "@/hooks/useGame"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

// --- Tipos auxiliares para UI ---
const getSuitColor = (naipe: string) => {
  return ["C", "O"].includes(naipe) ? "#d32f2f" : "#000"
}

// Componente para renderizar uma única carta (Debug style)
const DebugCard = ({ card }: { card: { valor: string; naipe: string } | undefined }) => {
  if (!card) return <View style={[styles.card, styles.cardEmpty]} />

  return (
    <View style={styles.card}>
      <Text style={[styles.cardText, { color: getSuitColor(card.naipe) }]}>
        {card.valor}
        {card.naipe}
      </Text>
    </View>
  )
}

export default function Debug() {
  const { state, dispatch } = useGame()
  const [loading, setLoading] = useState<boolean>(true)

  // Segurança para garantir que existem jogadores antes de acessar
  const jogadorAtual = state.players[state.table.iCurrentPlayer] || state.players[0]
  const canCheck = jogadorAtual ? jogadorAtual.currentBet === state.table.currentBet : false

  useEffect(() => {
    setLoading(true)
    // Se o jogo ainda não começou ou precisa de reset inicial
    if (state.phase === "PREFLOP" && state.table.pot === 0) {
      dispatch({ type: "INICIAR_RODADA" })
    }
    setLoading(false)
  }, [])

  const handleRestart = () => {
    dispatch({ type: "INICIAR_RODADA" }) // Certifique-se de ter essa action ou ajuste para INICIAR_RODADA
    setTimeout(() => dispatch({ type: "INICIAR_RODADA" }), 100)
  }

  if (loading || !jogadorAtual) {
    return (
      <View style={styles.center}>
        <Text>Carregando GameState...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Poker Debugger v0.1</Text>
        <TouchableOpacity onPress={handleRestart} style={styles.resetBtn}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea}>
        {/* --- INFO DA MESA --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MESA (Phase: {state.phase})</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>Pot: {state.table.pot}</Text>
            <Text style={styles.infoText}>Bet Atual: {state.table.currentBet}</Text>
            <Text style={styles.infoText}>Dealer Idx: {state.table.iDealer}</Text>
          </View>

          <Text style={styles.subTitle}>Community Cards:</Text>
          <View style={styles.cardsRow}>
            {state.table.communityCards.map((c, i) => (
              <DebugCard key={c.id} card={c} />
            ))}
            {state.table.communityCards.length === 0 && <Text style={styles.placeholder}>Sem cartas na mesa</Text>}
          </View>
        </View>

        {/* --- LISTA DE JOGADORES --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>JOGADORES</Text>
          {state.players.map((p, index) => {
            const isCurrent = index === state.table.iCurrentPlayer
            const isDealer = index === state.table.iDealer

            return (
              <View key={index} style={[styles.playerRow, isCurrent && styles.activePlayer]}>
                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, isCurrent && styles.bold]}>
                    {p.name} {isDealer && "Ⓓ"} {p.role && `[${p.role}]`}
                  </Text>
                  <Text style={styles.playerChips}>
                    Chips: {p.chips} | Bet: {p.currentBet} | {p.type}
                  </Text>
                  <View style={styles.statusRow}>
                    {p.isFold && <Text style={styles.tagFold}>FOLD</Text>}
                    {p.isAllIn && <Text style={styles.tagAllIn}>ALL-IN</Text>}
                  </View>
                </View>

                <View style={styles.playerCards}>
                  {p.hand.map((c) => (
                    <DebugCard key={c.id} card={c} />
                  ))}
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* --- AÇÕES (Controles) --- */}
      <View style={styles.controlsArea}>
        <Text style={styles.controlLabel}>
          Ação para: {jogadorAtual.name} ({jogadorAtual.type})
        </Text>
        <View style={styles.actionsContainer}>
          <Button
            buttonTitle="Fold"
            onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: "FOLD" } })}
            // Removi o disabled para permitir testar a ação mesmo sendo IA, útil para debug
            // disabled={jogadorAtual.type === "IA"}
          />
          <Button
            buttonTitle={canCheck ? "Check" : "Call"}
            onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: canCheck ? "CHECK" : "CALL" } })}
          />
          <Button
            buttonTitle="Raise (50)"
            onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 50 } })}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  resetBtn: {
    backgroundColor: "#d32f2f",
    padding: 6,
    borderRadius: 4,
  },
  resetText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  subTitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  cardsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
    minHeight: 40,
    alignItems: "center",
  },
  placeholder: {
    color: "#aaa",
    fontStyle: "italic",
    fontSize: 12,
  },
  // Cards Styling
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  cardEmpty: {
    backgroundColor: "#eee",
    borderStyle: "dashed",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  // Player Styling
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  activePlayer: {
    backgroundColor: "#e3f2fd", // Azul claro para indicar turno
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  playerChips: {
    fontSize: 12,
    color: "#666",
  },
  statusRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 2,
  },
  tagFold: {
    fontSize: 10,
    color: "#fff",
    backgroundColor: "#757575",
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  tagAllIn: {
    fontSize: 10,
    color: "#fff",
    backgroundColor: "#d32f2f",
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  playerCards: {
    flexDirection: "row",
    gap: 4,
  },
  // Controls Styling
  controlsArea: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingBottom: 30, // Safe area
  },
  controlLabel: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 12,
    color: "#555",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
})
