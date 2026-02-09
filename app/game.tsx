import Button from "@/components/Button"
import PlayerSeats from "@/components/PlayerSeats"
import RaiseModal from "@/components/RaiseModal"
import Table from "@/components/Table"
import useGame from "@/hooks/useGame"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

export default function Game() {
  const { state, dispatch } = useGame()
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)

  const jogadorAtual = state.players[state.table.iCurrentPlayer]
  const canCheck = jogadorAtual.currentBet === state.table.currentBet

  const handleRaise = (amount: number) => {
    dispatch({
      type: "ACAO_JOGADOR",
      payload: { move: "RAISE", amount },
    })
  }

  useEffect(() => {
    setLoading(true)
    dispatch({ type: "INICIAR_RODADA" })
    setLoading(false)
  }, [])

  if (loading) {
    return <Text>Carregando...</Text>
  }

  return (
    <View style={styles.container}>
      <Table state={state} />

      <PlayerSeats players={state.players} iCurrentPlayer={state.table.iCurrentPlayer} />

      <RaiseModal
        isVisible={isRaiseModalOpen}
        maxChips={jogadorAtual.chips}
        onClose={() => setIsRaiseModalOpen(false)}
        onConfirm={handleRaise}
      />

      <View style={styles.actionsContainer}>
        <Button
          buttonTitle="Fold"
          onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: "FOLD" } })}
          disabled={jogadorAtual.type === "IA"}
        />
        <Button
          buttonTitle={canCheck ? "Check" : "Call"}
          onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: canCheck ? "CHECK" : "CALL" } })}
          disabled={jogadorAtual.type === "IA"}
        />
        <Button buttonTitle="Raise" onPress={() => setIsRaiseModalOpen(true)} disabled={jogadorAtual.type === "IA"} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 12,
  },
  center: {
    textAlign: "center",
    zIndex: 10,
  },
  foldedPlayer: {
    color: "red",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
})
