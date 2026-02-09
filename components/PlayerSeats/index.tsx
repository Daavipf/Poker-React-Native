import { player } from "@/types/player"
import { useMemo } from "react"
import { View } from "react-native"
import EmptySeat from "../EmptySeat"
import Player from "../Player"
import { styles } from "./styles"

interface Props {
  players: player[]
  iCurrentPlayer: number
}

export default function PlayerSeats({ players, iCurrentPlayer }: Props) {
  const MAX_SEATS = 8

  const humanPlayerServerSeatIndex = players.length > 0 ? players[0].seatIndex : 0

  const seatsData = useMemo(() => {
    return Array.from({ length: MAX_SEATS }, (_, i) => i).map((serverSeatIndex) => {
      const player = players.find((p) => p.seatIndex === serverSeatIndex)

      const visualIndex = (serverSeatIndex - humanPlayerServerSeatIndex + MAX_SEATS) % MAX_SEATS

      return {
        serverSeatIndex,
        visualIndex,
        player,
      }
    })
  }, [players, humanPlayerServerSeatIndex])

  const renderSeat = (seat: (typeof seatsData)[0]) => {
    if (seat.player) {
      const isTurn = seat.serverSeatIndex === iCurrentPlayer
      return <Player key={`player-${seat.serverSeatIndex}`} player={seat.player} isTurn={isTurn} />
    }

    return <EmptySeat key={`empty-${seat.serverSeatIndex}`} />
  }

  const bottomSeat = seatsData.find((s) => s.visualIndex === 0)
  const leftSeats = seatsData.filter((s) => s.visualIndex >= 1 && s.visualIndex <= 3).reverse()
  const topSeat = seatsData.find((s) => s.visualIndex === 4)
  const rightSeats = seatsData.filter((s) => s.visualIndex >= 5 && s.visualIndex <= 7)

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* LINHA DO TOPO (Índice 4) */}
      <View style={styles.topRow}>{topSeat && renderSeat(topSeat)}</View>

      {/* ÁREA CENTRAL (Esquerda - Vazio - Direita) */}
      <View style={styles.middleRow}>
        {/* Coluna da Esquerda (Índices 1, 2, 3) */}
        <View style={styles.sideColumn}>{leftSeats.map(renderSeat)}</View>

        {/* Espaço central vazio (pula a mesa) */}
        <View style={styles.spacer} />

        {/* Coluna da Direita (Índices 5, 6, 7) */}
        <View style={styles.sideColumn}>{rightSeats.map(renderSeat)}</View>
      </View>

      {/* LINHA DA BASE (Índice 0 - Hero) */}
      <View style={styles.bottomRow}>{bottomSeat && renderSeat(bottomSeat)}</View>
    </View>
  )
}
