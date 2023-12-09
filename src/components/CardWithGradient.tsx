import { FC, useEffect, useState } from "react"
import { Pressable, View, ViewStyle } from "react-native"
import { ImageBackground } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { CardTitle } from "components/Text"

export interface CardWithGradientProps {
  /**
   * Title in the top-left corner of the card
   */
  title?: string
  /**
   * URL of the image in the background of the card
   */
  imageURL?: string
  /**
   * Blurhash of the image in the background of the card
   */
  blurhash?: string
  /**
   * Function called when the card is clicked
   * @default null
   */
  onClick?: () => void
  /**
   * whether or not to render the title closer to the top-left corner
   * @default false
   */
  closerToCorner?: boolean
  /**
   * Style of the card component
   * @default { marginBottom: 17, borderRadius: 12 }
   */
  style?: ViewStyle

  /**
   * optional, used for "In Evidenza" card
   */
  articleTitle?: string
  /**
   * Optional footer to show additional information
   */
  footer?: string
}

/**
 * Component useful to create clickable cards with a background image, a yellowish
 * linear gradient, and a title in the top-left corner.
 *
 * The card can be styled through props.
 */
export const CardWithGradient: FC<CardWithGradientProps> = props => {
  // border radius given to the background image and linear gradient (it matches the border radius of the card)
  const borderRadius =
    props.style && props.style.borderRadius !== undefined
      ? props.style.borderRadius
      : 12

  const closerToCorner = props.closerToCorner ?? false

  const [blurhash, setBlurhash] = useState<string>()
  useEffect(() => {
    // blurhash crashes on android if it's rendered immediatly
    // this immediatly re-renders the component after the first render
    setImmediate(() => {
      // for some fucking reason having question marks in the blurhash string breaks
      // expo images, on github it's marked as fixed but it's not fucking fixed
      const bh = (props.blurhash || "LEHLh[WB2yk8pyoJadR*.7kCMdnj").replace(
        /\?/g,
        "="
      )
      setBlurhash(bh)
    })
  }, [props.blurhash])

  return (
    <Pressable
      style={[
        {
          marginBottom: 17,
          borderRadius: borderRadius,
          overflow: "hidden",
        },
        props.style,
      ]}
      onPress={props.onClick}
    >
      <ImageBackground
        source={props.imageURL ? { uri: props.imageURL } : {}}
        placeholder={blurhash}
        style={{ flex: 1, alignItems: "stretch" }}
      >
        <LinearGradient
          colors={["rgba(255, 181, 68, 0.88)", "rgba(255, 181, 68, 0)"]}
          locations={[0, 0.5656]}
          style={{
            flex: 1,
            borderRadius: borderRadius,
          }}
        >
          <View
            style={{
              flex: 1,
              margin: closerToCorner ? 9 : 17,
              justifyContent: "space-between",
            }}
          >
            <View>
              <CardTitle style={{ lineHeight: 19 }}>{props.title}</CardTitle>
              {props.articleTitle && (
                <CardTitle
                  style={{
                    lineHeight: 19,
                    fontWeight: "500",
                  }}
                >
                  {props.articleTitle}
                </CardTitle>
              )}
            </View>
            {props.footer && (
              <View
                style={{
                  flexWrap: "wrap-reverse",
                }}
              >
                <View
                  style={{
                    backgroundColor: props.imageURL
                      ? "rgba(255, 181, 68, 0.8)"
                      : "rgba(255, 181, 68, 0.6)",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 8,
                  }}
                >
                  <CardTitle
                    style={{
                      fontSize: 13,
                      fontWeight: "300",
                    }}
                  >
                    {props.footer}
                  </CardTitle>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  )
}
