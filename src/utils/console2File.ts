const fs = require('fs')
const path = require('path')

export default function (content: any) {
  fs.appendFileSync(path.resolve(__dirname, '../temp/console.json'), JSON.stringify(content) + ',\n')
}
