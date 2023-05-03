import { BoxShadowView } from "components/BoxShadow"
import { NavBar } from "components/NavBar"
import { FC } from "react"
import { View, StyleSheet } from "react-native"
import { Text, Title } from "components/Text"
import { usePalette } from "utils/colors"

export interface PageWrapProps {
  title?: string | [string, string]

  upperTitle?: string

  children: React.ReactNode
}

export const PageWrap: FC<PageWrapProps> = props => {
  const { homeBackground, background, isLight, palette } = usePalette()

  return (
    <View style={[{ backgroundColor: homeBackground }, styles.container]}>
      {props.upperTitle && (
        <View
          style={{
            position: "absolute",
            top: 56,
            left: 26,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              color: isLight ? "#fff" : palette.accent,
              fontSize: 24,
              fontWeight: "900",
            }}
          >
            {props.upperTitle}
          </Text>
        </View>
      )}

      <BoxShadowView
        shadow={{
          color: "#000",
          offset: { y: -8 },
          opacity: 0.45,
          blur: 32,
        }}
        style={{
          flex: 1,
          marginTop: 100,
          overflow: "visible",
        }}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: "visible",
        }}
      >
        {props.title && (
          <View
            style={{
              padding: 28,
              paddingBottom: 0,
            }}
          >
            {typeof props.title === "string" ? (
              <Title>{props.title}</Title>
            ) : (
              <Title>
                <Title style={{ fontFamily: "Roboto_300Light" }}>
                  {props.title[0] + " "}
                </Title>
                {props.title[1]}
              </Title>
            )}
          </View>
        )}

        {props.children}
      </BoxShadowView>
      <NavBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
