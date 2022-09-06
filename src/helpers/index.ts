import { RuleUtils, FileFormat } from '@sketch-hq/sketch-assistant-types'

export function parsePath(path: string) {
    const paths = path.split('/')

    const result = []

    while (paths.length) {
        result.unshift(paths.splice(-2).join('/'))
    }

    return result
}

export const isLayerHidden = (layer: FileFormat.AnyLayer, utils: RuleUtils): boolean => {
    const path = utils.getObjectPointer(layer) as string
    const paths = parsePath(path)
    const length = paths.length

    const pointers = paths.map((_, index, array) => {
        return array.slice(0, length - index).join('/')
    })

    return pointers.some((pointer) => {
        const data = utils.evalPointer(pointer) as FileFormat.AnyLayer
        return data.isVisible === false
    })
}