import { ColorObj } from "../types"

// {"blue": 0.6313725490196078, "green": 0.6187450980392156, "red": 0.6208496732026143,} -> #9fa9a0
export const colorObjToHex = (colorObj: ColorObj) => {
  const { red, green, blue } = colorObj
  const redHex = Math.round(red * 255).toString(16).padStart(2, '0')
  const greenHex = Math.round(green * 255).toString(16).padStart(2, '0')
  const blueHex = Math.round(blue * 255).toString(16).padStart(2, '0')
  return `#${redHex}${greenHex}${blueHex}`.toUpperCase()
}