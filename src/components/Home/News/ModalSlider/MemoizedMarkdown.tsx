import React, { ReactNode, useCallback } from "react"
import Markdown, { ASTNode } from "react-native-markdown-display"
import { Pressable, StyleSheet } from "react-native"
import FitImage from "react-native-fit-image"
import { RenderImageFunction } from "react-native-markdown-display"
import { usePalette } from "utils/colors"

interface MemoizedMarkdownProps {
  content: string
  onPress?: (src: string) => void
}

//TODO: add carousel inside markdown in the future
/**
 *  Custom Markdown component which doesnt break on parent component state changes.
 *
 */
export const MemoizedMarkdown: React.FC<MemoizedMarkdownProps> = React.memo(
  ({ content, onPress }) => {
    const { isLight, background } = usePalette()

    const markdownStyle = StyleSheet.create({
      body: {
        fontSize: 16,
        marginBottom: -8,
        marginTop: -8,
        padding: 0,
        color: isLight ? "#000" : "#fff",
      },
      textgroup: { textAlign: "justify", width: "100%" },
      blockquote: {
        backgroundColor: !isLight ? background : "#F7F7F7",
      },
    })
    //TODO: How to typecheck this mess without silencing warnings?
    /**
     * Created this function to override the default image renderer of react-native-markdown-display
     * extended the default image renderer to add a Pressable component that will open the image in a modal
     *
     * source: https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js
     *
     *
     */
    const onRenderImage: RenderImageFunction = useCallback(
      (
        node: ASTNode,
        children: ReactNode[],
        parentNodes: ASTNode[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        styles: any,
        allowedImageHandlers: string[],
        defaultImageHandler: string
      ) => {
        const { src, alt } = node.attributes

        // we check that the source starts with at least one of the elements in allowedImageHandlers
        const show =
          allowedImageHandlers.filter(value => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            return src.toLowerCase().startsWith(value.toLowerCase())
          }).length > 0

        if (show === false && defaultImageHandler === null) {
          return null
        }

        const imageProps = {
          indicator: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          style: styles._VIEW_SAFE_image,
          source: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
            uri: show === true ? src : `${defaultImageHandler}${src}`,
          },
          accessible: false,
          accessibilityLabel: "",
        }

        if (alt) {
          imageProps.accessible = true
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          imageProps.accessibilityLabel = alt
        }

        return (
          <Pressable
            key={node.key}
            onPress={() => {
              if (onPress) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onPress(src)
              }
            }}
            style={{ width: "100%" }}
          >
            <FitImage {...imageProps} />
          </Pressable>
        )
      },
      []
    )

    return (
      <Markdown style={markdownStyle} rules={{ image: onRenderImage }}>
        {content}
      </Markdown>
    )
  }
)

MemoizedMarkdown.displayName = "MemoizedMarkdown"
