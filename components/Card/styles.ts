import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  cardContainer: {
    width: 30,
    height: 50,
    borderRadius: 4,
  },
  emptyCardContainer: {
    width: 30,
    height: 50,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCardSlot: {
    backgroundColor: "#00660e",
    borderWidth: 2,
    borderColor: "#003803",
  },
  activeCard: {
    backgroundColor: "#FFF",
    padding: 4,
  },
})
