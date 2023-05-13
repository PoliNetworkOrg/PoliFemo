import { EmptyListMessage } from "components/EmptyListMessage"
import { PageWrap, PageWrapProps } from "./PageWrap"
import { FlatList, ListRenderItem, View } from "react-native"
import { LoadingIndicator } from "components/LoadingIndicator"

type ListPageProps<T> = Omit<PageWrapProps, "children"> & {
  headerComponent?: React.ReactNode
  data: T[]
  renderItem: ListRenderItem<T>
  emptyMessage?: string
  loading?: boolean
}

export const ListPage = <T,>(props: ListPageProps<T>) => {
  return (
    <PageWrap
      title={props.title}
      upperTitle={props.upperTitle}
      switchControl={props.switchControl}
    >
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

      {props.loading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          data={props.data}
          renderItem={props.renderItem}
          style={{
            marginBottom: 93,
          }}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          ListEmptyComponent={<EmptyListMessage message={props.emptyMessage} />}
        />
      )}
    </PageWrap>
  )
}
