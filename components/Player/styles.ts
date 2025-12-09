import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  playerContainer: {
    flexDirection: "row",
  },
  profile: {
    width: 70,
    height: 70,
  },
  info: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 4,
  },
  roleButton: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 1,
  },
  dealerButton: {
    backgroundColor: "#FFF",
    borderColor: "#ececec",
  },
  bigBlindButton: {
    backgroundColor: "#c94a4aff",
    borderColor: "#7a1f1fff",
  },
  smallBlindButton: {
    backgroundColor: "#c9bc4aff",
    borderColor: "#7f7628ff",
  },
  bigBlindText: {
    color: "#FFF",
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 4,
  },
})
