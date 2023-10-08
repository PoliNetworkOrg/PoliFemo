import { FC, useCallback, useEffect } from "react"
import { Pressable, View } from "react-native"

import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import deleteIcon from "assets/menu/delete.svg"
import { Icon } from "components/Icon"
import { useTranslation } from "react-i18next"

export enum ButtonType {
  CALENDAR,
  TIMETABLE,
  ASSOCIATIONS,
  FREECLASSROOMS,
  MATERIALS,
  GROUPS,
  MARKS,
  GRADING_BOOK,
  TEST,
  ADD,
}

export interface ButtonInterface {
  type: ButtonType
  title: string
  icon: number
  onClick: () => void
}

/**
 * single buttons for the main menu, with custom icons and titles
 */
export const MenuButton: FC<{
  onPress: () => void
  onLongPress?: () => void
  buttonIcon: ButtonInterface
  isDeleting: boolean
  onDelete?: () => void
  inMenu?: boolean
}> = ({ onPress, onLongPress, buttonIcon, isDeleting, onDelete, inMenu }) => {
  const { palette, isDark } = usePalette()
  const color = isDark && inMenu ? palette.lighter : palette.primary

  const animatedValue = useSharedValue(0)

  const { t } = useTranslation("home") //i18m hook

  //function to call to perform the shake of the button
  const handleAnimation = useCallback(() => {
    animatedValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 100 + (Math.random() * 40 - 20) }),
        withTiming(-1, { duration: 100 + (Math.random() * 40 - 20) })
      ),
      -1
    )
  }, [animatedValue])

  useEffect(() => {
    if (isDeleting) handleAnimation()
    else {
      animatedValue.value = withTiming(0, { duration: 100 })
    }
  }, [isDeleting, animatedValue])

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate:
          interpolate(animatedValue.value, [-1, 1], [-0.025, 0.025]) + "rad",
      },
    ],
  }))

  return (
    <View>
      <Animated.View style={animStyle}>
        <Pressable onPress={onPress} onLongPress={onLongPress}>
          <View
            style={{
              width: 84,
              height: 70,
              backgroundColor: color,
              paddingVertical: 10,
              marginHorizontal: 6,
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              marginTop: 15, //added margin to the top due to the deleting operation
            }}
          >
            <Icon style={{ flex: 1, width: 40 }} source={buttonIcon.icon} />
            <BodyText
              style={{
                fontSize: 10,
                color: "white",
              }}
            >
              {t(buttonIcon.title)}
            </BodyText>
          </View>
        </Pressable>
        {isDeleting && buttonIcon.type !== ButtonType.ADD && (
          <Pressable
            style={{
              position: "absolute",
              width: 25,
              height: 25,
              right: 0,
              bottom: 57,
            }}
            onPress={() => {
              onDelete && onDelete()
            }}
            hitSlop={10}
          >
            <Icon source={deleteIcon} />
          </Pressable>
        )}
      </Animated.View>
    </View>
  )
}
