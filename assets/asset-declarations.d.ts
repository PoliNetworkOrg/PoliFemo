declare module "*.png" {
  import { ImageSourcePropType } from "react-native"
  const value: ImageSourcePropType
  export default value
}

declare module "*.svg" {
  const value: number
  export default value
}
