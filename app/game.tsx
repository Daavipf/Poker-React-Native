import Button from "@/components/Button"
import useGame from "@/hooks/useGame"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

export default function Game() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  const [loading, setLoading] = useState<boolean>(true)

  const jogadorAtual = state.players[state.table.iCurrentPlayer]

  useEffect(() => {
    setLoading(true)
    dispatch({ type: "INICIAR_RODADA" })
    setLoading(false)
  }, [])

  function leave() {
    router.navigate("/mainMenu")
    router.dismissAll()
  }

  if (loading) {
    return <Text>Carregando...</Text>
  }

  return (
    <View style={style.container}>
      <View>
        <Text style={style.center}>Fase: {state.phase}</Text>
        <Text style={style.center}>Pot: {state.table.pot}</Text>
        <Text style={style.center}>Bet Atual: {state.table.currentBet}</Text>
        <Text style={style.center}>{state.message}</Text>
        {state.phase !== "PREFLOP" && (
          <View style={style.communityCardsContainer}>
            {state.table.communityCards.map((carta) => (
              <Text key={carta.id}>{carta.id}</Text>
            ))}
          </View>
        )}
      </View>

      {/* 2. Renderiza os Jogadores */}
      <View>
        {state.players.map((jogador, index) => (
          <View key={index}>
            <Text style={[style.center, jogador.isFold ? style.foldedPlayer : null]}>
              {jogador.name} - {jogador.chips} - {jogador.currentBet}
            </Text>

            <View style={style.communityCardsContainer}>
              {jogador.hand.map((carta) => (
                <Text key={carta.id}>{carta.id}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* 3. Renderiza as Ações para o jogador ativo */}
      <View>
        <Text style={style.center}>Turno de: {jogadorAtual.name}</Text>

        {/* Os botões apenas enviam ações. Eles não sabem a lógica. */}
        <Button buttonTitle="Fold" onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: "FOLD" } })} />
        <Button buttonTitle="Call" onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: "CALL" } })} />
        <Button buttonTitle="Check" onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: "CHECK" } })} />
        <Button
          buttonTitle="Raise"
          onPress={() => dispatch({ type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 50 } })}
        />
        <Button buttonTitle="Next Phase" onPress={() => dispatch({ type: "AVANCAR_FASE" })} />
      </View>
      <Button buttonTitle="Sair" onPress={() => leave()} />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  center: {
    textAlign: "center",
  },
  communityCardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  foldedPlayer: {
    color: "red",
  },
})
