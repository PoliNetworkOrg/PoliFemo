import { MainStackScreen } from "navigation/NavigationTypes"
import { ArticleDetailsWrapper } from "components/Home/News/ArticleDetailsWrapper"
import React, { useCallback, useRef, useState } from "react"
import { extractImageLinks, getArticleParams } from "utils/articles"
import { useCurrentLanguage } from "utils/language"
import { ModalSlider } from "components/Home/News/ModalSlider/ModalSlider"
import { MemoizedMarkdown } from "components/Home/News/ModalSlider/MemoizedMarkdown"
import { Image } from "expo-image"

declare module "react-native-markdown-display" {
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  interface MarkdownProps {
    children?: React.ReactNode
  }
}

export const Article: MainStackScreen<"Article"> = props => {
  const currentLanguage = useCurrentLanguage()

  const article = props.route.params.article
  const articleParams = getArticleParams(article, currentLanguage)

  const content = useRef(articleParams?.content || "").current

  const [isModalVisible, setIsModalVisible] = useState(false)

  const imageSources = useRef(extractImageLinks(content)).current

  const activeIndex = useRef(0)

  const onImagePress = useCallback((src: string) => {
    activeIndex.current = imageSources.indexOf(src)
    setIsModalVisible(true)
  }, [])

  return (
    <ArticleDetailsWrapper
      navbarOptions={{ elevated: true }}
      title={articleParams?.title}
      subtitle={articleParams?.subtitle}
      backdropElement={
        article.image ? (
          <Image
            source={{
              uri: article.image,
            }}
            placeholder={article.blurhash}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : undefined
      }
    >
      <MemoizedMarkdown content={content} onPress={onImagePress} />

      <ModalSlider
        activeIndex={activeIndex.current}
        imageSources={imageSources}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </ArticleDetailsWrapper>
  )
}
