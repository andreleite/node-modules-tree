import fs from 'fs'
import path from 'path'
import detective from 'detective-es6'

export default function (main) {
  let data = {}

  function isLocalModule (module) {
    return module[0] === '.'
  }

  function getPath (module, child) {
    if (!path.extname(child)) child += '.js'
    let location = path.join(path.dirname(module), child)
    if (!fs.existsSync(location)) return null
    return location
  }

  function getChildrenComponents (module) {
    if (path.extname(module) !== '.js') return []
    return detective(fs.readFileSync(module, 'utf8'))
      .filter(isLocalModule)
  }

  function processDependencies (module = main) {
    if (data[module] !== undefined) return
    data[module] = []
    getChildrenComponents(module).forEach((child) => {
      if (child === module) return
      let location = getPath(module, child)
      if (!location) return
      data[module].push(location)
    })
    data[module].forEach((child) => {
      processDependencies(child)
    })
  }

  processDependencies()
  return data
}
