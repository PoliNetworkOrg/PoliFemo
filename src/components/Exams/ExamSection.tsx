import { AdaptiveShadowView } from "components/BoxShadow"
import { BodyText } from "components/Text"
import { FC } from "react"
import { Pressable, View } from "react-native"
import { palette } from "utils/colors"
import { Icon } from "components/Icon"
import arrowRightSvg from "assets/exams/arrow_right.svg"

export interface ExamSectionProps {
  title: string
  onPress: () => void
  children: React.ReactNode
}

export const ExamSection: FC<ExamSectionProps> = props => {
  return (
    <View
      style={{
        alignItems: "stretch",
        marginBottom: 16,
        marginHorizontal: 16,
        borderRadius: 16,
        backgroundColor: palette.lighter,
      }}
    >
      <AdaptiveShadowView
        style={{ marginBottom: 16 }}
        contentContainerStyle={{
          backgroundColor: palette.primary,
          height: 52,
          flex: 1,
          paddingVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 16,
        }}
        shadow={{ offset: { y: 4 }, opacity: 0.25, blur: 4 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <BodyText
            style={{
              fontWeight: "900",
              color: "white",
              fontSize: 16,
              flex: 1,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {props.title}
          </BodyText>
          <Pressable
            style={{
              width: 40,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
            onPress={props.onPress}
            hitSlop={10}
          >
            <Icon source={arrowRightSvg} scale={1.2} />
          </Pressable>
        </View>
      </AdaptiveShadowView>
      {props.children}
    </View>
  )
}
