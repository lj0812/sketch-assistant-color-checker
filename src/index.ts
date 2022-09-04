import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage, RuleDefinition, FileFormat } from '@sketch-hq/sketch-assistant-types'
import { ColorObj } from './types'
import { allStandardColors } from './data'
import { colorObjToHex } from './utils'
// import log from './utils/console2File'





// const colorCheck: RuleDefinition = {
//   rule: async (context) => {
//     context.utils.report('Hello world')
//     const { utils } = context

//     const errorLayerSets = []

//     for (const style of utils.objects.style) {
//       let colors = []

//       const colorObj = style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute
//       colors.push(colorObj)
//       style.fills?.forEach(fill => {
//         colors.push(fill.color)
//         if (fill.gradient) {
//           fill.gradient.stops.forEach(stop => {
//             colors.push(stop.color)
//           })
//         }
//       })
//       style.borders?.forEach(border => {
//         colors.push(border.color)
//       })

//       const hexColors = colors
//         .filter(color => color !== undefined)
//         .map(color => {
//           // fs.appendFileSync(path.resolve(__dirname, './temp/layer.json'), JSON.stringify(color) + ',\n')
//           if (JSON.stringify(color) === '{}') {
//             const layer = utils.getObjectParent(style)
//             console.log('color', layer)
//           }
//           return colorObjToHex(color as ColorObj)
//         })
//       const hasErrorColor = hexColors.some(hex => !Boolean(allColors[hex]))


//       if (hasErrorColor) {
//         const layer = utils.getObjectParent(style)
//         errorLayerSets.push(layer)
//       }
//     }

//     const set = new Set()

//     errorLayerSets.forEach((layer) => {
//       set.add((layer as FileFormat.AnyLayer).do_objectID)
//     })

//     console.log(errorLayerSets.length, set.size)

//     errorLayerSets.forEach(layer => {
//       fs.appendFileSync(path.resolve(__dirname, './temp/layer.json'), JSON.stringify(layer) + ',\n')

//       utils.report(`Layer has an invalid color`, layer as FileFormat.AnyLayer)
//     })
//   },
//   name: 'sketch-assistant-color-checker/color-check',
//   title: '颜色不在规范色中',
//   description: '检查颜色是否是预设的颜色',
// }
// console.log(colorCheck.name)


// 获取layer所在的page
// const getPage = (utils: RuleUtils, layer: FileFormat.AnyLayer): FileFormat.Page  => {
//   const objects = utils.getObjectParents(layer) as FileFormat.AnyLayer[]

//   return objects.find(obj => {
//     return obj._class === 'page'
//   }) as FileFormat.Page
// }

const textColorCheck: RuleDefinition = {
  rule: async (context) => {
    context.utils.report('Hello world')
    const { utils } = context

    for (const text of utils.objects.text) {
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
    context.utils.report('Hello world')
    const { utils } = context

    for (const shape of utils.objects.shapePath) {
      const colors: FileFormat.Color[] = []
      shape.style?.fills?.forEach(fill => {
        colors.push(fill.color)
        if (fill.gradient) {
          fill.gradient.stops.forEach(stop => {
            colors.push(stop.color)
          })
        }
      })

      const hexColors = colors.map((color) => {
        return colorObjToHex(color as ColorObj)
      })

      const hasErrorColor = hexColors.some((hex: string) => !Boolean(allStandardColors[hex]))

      if (hasErrorColor) {
        utils.report(`填充颜色不在规范色中`, shape)
      }
    }
  },
  name: 'sketch-assistant-color-checker/fill-color-check',
  title: '填充颜色不在规范色中',
  description: '检查填充颜色是否是预设的颜色',
}

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'sketch-assistant-color-checker',
      rules: [textColorCheck, fillColorCheck],
      config: {
        rules: {
          'sketch-assistant-color-checker/text-color-check': {
            active: true,
          },
          'sketch-assistant-color-checker/fill-color-check': {
            active: true,
          },
        },
      },
    }
  }
]

export default assistant
