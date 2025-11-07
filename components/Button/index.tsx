import { Text, TouchableOpacity } from "react-native"
import { style } from "./style"

interface Props {
  buttonTitle: string
  onPress?: () => void
}

export default function Button({ buttonTitle, onPress }: Props) {
  return (
    <TouchableOpacity style={style.container} onPress={onPress}>
      <Text>{buttonTitle}</Text>
    </TouchableOpacity>
  )
}
