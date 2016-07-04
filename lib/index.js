import minimist from 'minimist'
import getDependencies from './get-dependencies'
import makeTree from './make-tree'

let args = minimist(process.argv.slice(1))
let main = args.f
let highlightContent = args.c
let highlightName = args.n
let json = args.j

export function run () {
  if (main) {
    let data = getDependencies(main)
    let tree = makeTree(main, data, highlightContent, highlightName)
    if (json) {
      console.log(data)
    } else {
      console.log(tree)
    }
  } else {
    console.log(
      '\n',
      '  $ node-modules-tree <params>',
      '\n',
      '\n',
      '  Parameters:',
      '\n',
      '\n',
      '  -f  file to start',
      '\n',
      '  -c  files with this pattern in its content will be highlighted',
      '\n',
      '  -n  files with this pattern in its name will be highlighted',
      '\n',
      '  -j  output the result as json',
      '\n'
    )
  }
}
