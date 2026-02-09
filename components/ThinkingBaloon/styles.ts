import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  balloon: {
    position: "absolute",
    top: -15, // Ajuste conforme o tamanho do seu avatar
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    zIndex: 20,
    minWidth: 40,
  },
  dots: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 20,
  },
  arrow: {
    position: "absolute",
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFF",
  },
})
