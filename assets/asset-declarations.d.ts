declare module "*.png" {
  import { ImageSourcePropType } from "react-native"
  const value: ImageSourcePropType
  export default value
}

declare module "*.svg" {
  import { DataSourceParam } from "@shopify/react-native-skia"
  const value: DataSourceParam
  export default value
}
