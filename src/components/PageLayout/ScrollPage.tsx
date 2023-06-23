import { FC } from "react"
import { PageWrap, PageWrapProps } from "./PageWrap"
import { ScrollView } from "react-native-gesture-handler"
import { StyleProp, View, ViewStyle } from "react-native"

type ScrollPageProps = PageWrapProps & {
  headerComponent?: React.ReactNode
  /**
   * Style to be passed to the ScrollView contentContainerStyle prop.
   */
  contentContainerStyle?: StyleProp<ViewStyle>

  /**
   * If true, the page will have a padding of 28 on the sides, useful for most pages.
   */
  padded?: boolean
}

/**
 * Wrapper for a page with a scroll view, just gives the right background, shadow
 * and styles.
 * The scroll view already has content overflow hidden, with right border radius,
 * and the right padding on the sides via the `padding` prop.
 */
export const ScrollPage: FC<ScrollPageProps> = props => {
  return (
    <PageWrap title={props.title} upperTitle={props.upperTitle}>
      {props.headerComponent && (
        <View
          style={{
            paddingHorizontal: 28,
            paddingBottom: 0,
          }}
        >
          {props.headerComponent}
        </View>
      )}

      <ScrollView
        alwaysBounceVertical={false}
        style={{
          overflow: "hidden",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        contentContainerStyle={[
          {
            overflow: "visible",
            paddingBottom: 130,
          },
          props.padded && {
            paddingHorizontal: 28,
          },
          props.contentContainerStyle,
        ]}
      >
        {props.children}
      </ScrollView>
    </PageWrap>
  )
}
