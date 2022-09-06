import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage, RuleDefinition, FileFormat } from '@sketch-hq/sketch-assistant-types'
import { ColorObj } from './types'
import { allStandardColors } from './data'
import { colorObjToHex } from './utils'
import { isLayerHidden } from './helpers'

const textColorCheck: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const text of utils.objects.text) {
      if (isLayerHidden(text, utils)) {
        continue
      }

      const colorObj = text?.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute
      const hexColor = colorObjToHex(colorObj as ColorObj)
      if (!Boolean(allStandardColors[hexColor])) {
        utils.report(`文本颜色不在规范色中`, text)
      }
    }
  },
  name: 'sketch-assistant-color-checker/text-color-check',
  title: '文本颜色不在规范色中',
  description: '检查文本颜色是否是预设的颜色',
}

const fillColorCheck: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const rectangle of utils.objects.rectangle) {

      if (isLayerHidden(rectangle, utils)) {
        continue
      }

      if (rectangle.booleanOperation !== FileFormat.BooleanOperation.None) {
        continue
      }

      // 宽高至少要有一项大于100
      if (rectangle.frame.width < 100 && rectangle.frame.height < 100) {
        continue
      }

      const colors: FileFormat.Color[] = []

      rectangle.style?.fills?.forEach((fill) => {
        fill.isEnabled && colors.push(fill.color)
      })

      rectangle.style?.borders?.forEach((border) => {
        border.isEnabled && colors.push(border.color)
      })

      const hexColors = colors.map((color) => {
        return colorObjToHex(color as ColorObj)
      })

      const hasErrorColor = hexColors.some((hex: string) => !Boolean(allStandardColors[hex]))

      if (hasErrorColor) {
        utils.report(`填充颜色不在规范色中`, rectangle)
      }
    }
  },
  name: 'sketch-assistant-color-checker/fill-color-check',
  title: '填充颜色不在规范色中',
  description: '检查填充颜色是否是预设的颜色',
}

const artboardBackgroundColorCheck: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const artboard of utils.objects.artboard) {
      if (artboard.hasBackgroundColor) {
        const colorObj = artboard.backgroundColor

        const hexColor = colorObjToHex(colorObj as ColorObj)
        if (!Boolean(allStandardColors[hexColor])) {
          utils.report(`画板背景色不在规范色中`, artboard)
        }
      }
    }
  },
  name: 'sketch-assistant-color-checker/artboard-background-color-check',
  title: '画板背景色不在规范色中',
  description: '检查画板背景色是否是预设的颜色',
}

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'sketch-assistant-color-checker',
      rules: [textColorCheck, fillColorCheck, artboardBackgroundColorCheck],
      config: {
        rules: {
          'sketch-assistant-color-checker/text-color-check': {
            active: true,
          },
          'sketch-assistant-color-checker/fill-color-check': {
            active: true,
          },
          'sketch-assistant-color-checker/artboard-background-color-check': {
            active: true,
          },
        },
      },
    }
  }
]

export default assistant
