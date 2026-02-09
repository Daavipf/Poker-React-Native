import Button from "@/components/Button"
import Slider from "@react-native-community/slider"
import React, { useState } from "react"
import { Modal, StyleSheet, Text, View } from "react-native"

interface RaiseModalProps {
  isVisible: boolean
  onClose: () => void
  onConfirm: (amount: number) => void
  maxChips: number
  minRaise?: number
}

export default function RaiseModal({ isVisible, onClose, onConfirm, maxChips, minRaise = 50 }: RaiseModalProps) {
  const [amount, setAmount] = useState(minRaise)

  const handleConfirm = () => {
    onConfirm(amount)
    onClose()
  }

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Definir Aposta</Text>

          <Text style={styles.amountDisplay}>$ {amount}</Text>

          <Slider
            style={styles.slider}
            minimumValue={minRaise}
            maximumValue={maxChips}
            step={5}
            value={amount}
            onValueChange={(val) => setAmount(Math.floor(val))}
            minimumTrackTintColor="#2ecc71"
            maximumTrackTintColor="#bdc3c7"
            thumbTintColor="#27ae60"
          />

          <View style={styles.row}>
            <Text style={styles.limitText}>Min: {minRaise}</Text>
            <Text style={styles.limitText}>Max: {maxChips}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button buttonTitle="Cancelar" onPress={onClose} disabled={false} />
            <Button buttonTitle="Confirmar" onPress={handleConfirm} disabled={false} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  amountDisplay: {
    fontSize: 32,
    fontWeight: "900",
    color: "#27ae60",
    marginVertical: 15,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  limitText: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
})
