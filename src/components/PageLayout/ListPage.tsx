import { EmptyListMessage } from "components/EmptyListMessage"
import { PageWrap, PageWrapProps } from "./PageWrap"
import { FlatList, ListRenderItem, View } from "react-native"
import { LoadingIndicator } from "components/LoadingIndicator"
import { ErrorMessage } from "components/ErrorMessage"

type ListPageProps<T> = Omit<PageWrapProps, "children"> & {
  /**
   * Component to be put above the list and under the title.
   */
  headerComponent?: React.ReactNode

  /**
   * Data to be rendered in the list.
   */
  data: T[]

  /**
   * Function to render each item in the list, same sa `FlatList`'s `renderItem`.
   */
  renderItem: ListRenderItem<T>

  /**
   * Message to be displayed when there is an error, passing anything here will
   * make the list not render.
   */
  errorMessage?: string

  /**
   * Message to be displayed when the list is empty, only displayed when the data
   * array is empty.
   */
  emptyMessage?: string

  /**
   * Whether the list is loading or not, if true displays a loading indicator
   * instead of the list.
   */
  loading?: boolean
}

/**
 * A component that wraps a page with a header component and a list of items.
 * @example
 * ```tsx
 * <ListPage
 *  title="Title"
 *  headerComponent={<View>
 *    <Text>Some text</Text>
 *  </View>}
 *  data={data}
 *  renderItem={({ item }) => <Text>{item}</Text>}
 * />
 * ```
 */
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

      {props.errorMessage ? (
        <ErrorMessage message={props.errorMessage} />
      ) : props.loading ? (
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
