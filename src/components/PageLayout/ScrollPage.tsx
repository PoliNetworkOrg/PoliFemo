import { FC } from "react"
import { PageWrap, PageWrapProps } from "./PageWrap"
import { ScrollView } from "react-native-gesture-handler"
import { View } from "react-native"

export const ScrollPage: FC<
  PageWrapProps & {
    headerComponent?: React.ReactNode
  }
> = props => {
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
        contentContainerStyle={{ overflow: "visible" }}
      >
        {props.children}
      </ScrollView>
    </PageWrap>
  )
}
