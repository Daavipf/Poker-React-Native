import { Text, TouchableOpacity } from "react-native"
import { style } from "./style"

interface Props {
  buttonTitle: string
  onPress?: () => void
  disabled?: boolean
}

export default function Button({ buttonTitle, onPress, disabled = true }: Props) {
  return (
    <TouchableOpacity style={style.container} onPress={onPress} disabled={!disabled}>
      <Text>{buttonTitle}</Text>
    </TouchableOpacity>
  )
}
