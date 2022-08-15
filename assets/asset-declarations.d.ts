declare module "*.png" {
    import { ImageSourcePropType } from "react-native"
    const value: ImageSourcePropType
    export default value
}

declare module "*.svg" {
    import React from "react"
    import { SvgProps } from "react-native-svg"
    const value: React.FC<SvgProps>
    export default value
}
