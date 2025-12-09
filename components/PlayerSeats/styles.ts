import { StyleSheet } from "react-native"
export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  topRow: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  bottomRow: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    marginBottom: 100,
  },
  middleRow: {
    flex: 1,
    flexDirection: "row",
  },
  sideColumn: {
    width: 80,
    justifyContent: "space-around",
    alignItems: "center",
  },
  spacer: {
    flex: 1,
  },
})
