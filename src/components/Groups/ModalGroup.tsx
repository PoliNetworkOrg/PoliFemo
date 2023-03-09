import { FC } from "react"
import { ViewStyle } from "react-native"
import { usePalette } from "utils/colors"
import { Group } from "api/groups"
import { BodyText } from "components/Text"
import { Modal } from "components/Modal"
import { choosePlatformIcon } from "utils/groups"

export interface ModalGroupProps {
  /**
   * whether ot not to show the modal
   */
  isShowing: boolean
  /**
   * this function hides the modal by changing the state in the parent component
   */
  onClose: () => void

  /**
   * function called when button "JOIN GROUP" is pressed
   */
  onJoin: (group?: Group) => void

  group: Group

  animationTiming?: number

  /**override center container's style, for example changing height */
  style?: ViewStyle
}

/**
 * Custom Modal Component for Groups Page.
 *
 */
export const ModalGroup: FC<ModalGroupProps> = props => {
  const { isLight } = usePalette()

  const icon = choosePlatformIcon(props.group?.platform)
  const scaleFactor = 2.5

  return (
    <Modal
      isShowing={props.isShowing}
      centerText
      title={props.group.class ?? ""}
      icon={icon ? { source: icon, scale: scaleFactor } : undefined}
      onClose={props.onClose}
      buttons={[
        {
          text: "JOIN GROUP",
          onPress: () => props.onJoin(props.group),
        },
      ]}
    >
      {props.group?.members && (
        <BodyText
          style={{
            fontSize: 13,
            fontWeight: "400",
            color: isLight ? "#8791BD" : "#fff",
            textAlign: "center",
          }}
        >
          {props.group.members} members
        </BodyText>
      )}
      <BodyText
        style={{
          fontSize: 13,
          fontWeight: "400",
          color: isLight ? "#414867" : "#fff",
          textAlign: "center",
          marginTop: 16,
        }}
      >
        {props.group?.year}
      </BodyText>
    </Modal>
  )
}
