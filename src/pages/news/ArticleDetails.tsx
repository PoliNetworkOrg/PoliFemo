import { MainStackScreen } from "navigation/NavigationTypes"
import { Image } from "react-native"
import { ArticleDetailsWrapper } from "components/Home/News/ArticleDetailsWrapper"
import React, { useCallback, useRef, useState } from "react"
import { extractImageLinks, useCurrentLanguage } from "utils/articles"
import { ModalSlider } from "components/Home/News/ModalSlider/ModalSlider"
import { MemoizedMarkdown } from "components/Home/News/ModalSlider/MemoizedMarkdown"

declare module "react-native-markdown-display" {
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  interface MarkdownProps {
    children?: React.ReactNode
  }
}

export const Article: MainStackScreen<"Article"> = props => {
  const currentLanguage = useCurrentLanguage()

  const article = props.route.params.article

  const title =
    currentLanguage === "it"
      ? article.content.it.title
      : article.content.en.title

  const subtitle =
    currentLanguage === "it"
      ? article.content.it.subtitle
      : article.content.en.subtitle

  const content = useRef(
    article.id === 10
      ? "E’ online la guida di tutti gli incontri e i servizi del Career Service per gli studenti nel prossimo semestre.\n\r![ciao](https://images.unsplash.com/photo-1599009434802-ca1dd09895e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)\n\r![ciao](https://images.unsplash.com/photo-1685681564926-41c950d7434a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80)\n\rPer maggiori informazioni:  \r\n[www.careerservice.polimi.it/](https://cm.careerservice.polimi.it/2023/02/08/career-service-guide-feb-lug-2023-2-semestre/)"
      : currentLanguage === "it"
      ? article.content.it.content
      : article.content.en.content
  ).current

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
      title={title}
      subtitle={subtitle}
      backdropElement={
        article.image ? (
          <Image
            source={{
              uri: article.image,
            }}
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
