import { FC, useMemo } from "react"
import { StyleProp, ViewStyle } from "react-native"
import colorString from "color-string"
import { Canvas, ImageSVG, Skia } from "@shopify/react-native-skia"

export interface BoxShadowCanvasProps {
  shadow: {
    color?: string
    offset?: {
      x?: number
      y?: number
    }
    opacity?: number
    spread?: number
    blur?: number
  }
  canvasDimensions?: {
    width?: number
    height?: number
    radii?: [number, number, number, number]
  }
  canvasStyle?: StyleProp<ViewStyle>
}

function createBoxShadowPath(
  width: number,
  height: number,
  radii: [number, number, number, number]
) {
  const path = Skia.Path.Make()
  const [tl, tr, br, bl] = radii
  path.moveTo(tl, 0)
  path.lineTo(width - tr, 0)
  path.arcToRotated(tr, tr, 90, true, false, width, tr)
  path.lineTo(width, height - br)
  path.arcToRotated(br, br, 90, true, false, width - br, height)
  path.lineTo(bl, height)
  path.arcToRotated(bl, bl, 90, true, false, 0, height - bl)
  path.lineTo(0, tl)
  path.arcToRotated(tl, tl, 90, true, false, tl, 0)
  path.close()
  return path.toSVGString()
}

export const BoxShadowCanvas: FC<BoxShadowCanvasProps> = ({
  shadow,
  canvasDimensions,
  canvasStyle,
}) => {
  const shad = {
    color: "black",
    opacity: 1,
    spread: 0,
    blur: 0,
    ...shadow,
    offset: { x: 0, y: 0, ...shadow?.offset },
  }

  const c = colorString.get.rgb(shad.color)
  if (!c) {
    throw new Error(`${shad.color} is not a valid color}`)
  }
  const [r, g, b, a] = c

  const viewBoxOffset = shad.spread + shad.blur * 2
  const width = canvasDimensions?.width ?? 30
  const height = canvasDimensions?.height ?? 30
  const totWidth = width + viewBoxOffset * 2
  const totHeight = height + viewBoxOffset * 2

  const xnegoffset = -viewBoxOffset + shad.offset.x
  const ynegoffset = -viewBoxOffset + shad.offset.y

  const svg = useMemo(() => {
    const viewBox = `${xnegoffset} ${ynegoffset} ${totWidth} ${totHeight}`

    return Skia.SVG
      .MakeFromString(`<svg xmlns="http://www.w3.org/2000/svg" width="${totWidth}" height="${totHeight}" viewBox="${viewBox}" fill="none">
    <g filter="url(#a)">
      <path fill="white" d="${createBoxShadowPath(
        width,
        height,
        canvasDimensions?.radii ?? [0, 0, 0, 0]
      )}" shape-rendering="crispEdges"/>
    </g>
    <defs>
      <filter id="a" width="${totWidth}" height="${totHeight}" x="${xnegoffset}" y="${ynegoffset}" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feMorphology in="SourceAlpha" operator="dilate" radius="${
          shad.spread
        }" result="effect1_dropShadow_1_3"/>
        <feOffset dx="${shad.offset.x}" dy="${shad.offset.y}"/>
        <feGaussianBlur stdDeviation="${shad.blur / 2}"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix values="0 0 0 0 ${r / 255} 0 0 0 0 ${g / 255} 0 0 0 0 ${
      b / 255
    } 0 0 0 ${a * shad.opacity} 0"/>
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1_3"/>
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_3" result="shape"/>
      </filter>
    </defs>
  </svg>`)
  }, [
    shad.blur,
    shad.color,
    shad.offset.x,
    shad.offset.y,
    shad.opacity,
    shad.spread,
    height,
    width,
    canvasDimensions?.radii,
  ])

  if (!svg) {
    throw new Error("Could not create SVG")
  }

  if (width === 0 || height === 0) return null

  return (
    <Canvas
      style={[
        {
          width: totWidth,
          height: totHeight,
          position: "absolute",
          zIndex: -1,
          left: xnegoffset,
          top: ynegoffset,
        },
        canvasStyle,
      ]}
    >
      <ImageSVG svg={svg} x={0} y={0} width={totWidth} height={totHeight} />
    </Canvas>
  )
}
