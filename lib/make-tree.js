import fs from 'fs'
import path from 'path'
import colors from 'colors/safe'

export default function (main, data, highlightContent, highlightName) {
  let tree = []

  function isHighlighted (module) {
    if (!highlightContent && !highlightName) return false
    let check = false
    if (highlightName) check = check || module.indexOf(highlightName) !== -1
    if (highlightContent) {
      check = check || fs.readFileSync(path.join(process.cwd(), module), 'utf8').indexOf(highlightContent) !== -1
    }
    return check
  }

  function makeTree (module = main, level = 0) {
    if (module === main) tree.push(main)
    data[module].forEach((dep) => {
      let counter = level
      let line = []
      while (counter--) {
        let lastLine = tree[tree.length - 1]
        let actualLenght = line.join('').length
        let char = lastLine[actualLenght]
        if (char === '└' || char === ' ') {
          line.push('    ')
        } else {
          line.push('│   ')
        }
      }
      if (dep !== data[module][data[module].length - 1]) {
        line.push('├── ')
      } else {
        line.push('└── ')
      }
      line.push(isHighlighted(dep) ? colors.bgYellow.bold(dep) : dep)
      tree.push(line.join(''))
      makeTree(dep, level + 1)
    })
  }

  makeTree()
  tree.unshift('')
  tree.push('')
  return tree.join('\n')
}
