import {terser} from "rollup-plugin-terser"
import {version, name} from '../package.json'

const banner =
  '/*!\n' +
  ' * '+ name +' v' + version + '\n' +
  ' * (c) 2018-' + new Date().getFullYear() + ' Sunny\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const getConfig = format => {
  const min = format[0] === '@'
  if (min) format = format.substring(1)

  return {
    input: 'src/index.js',
    output: {
      file: `dist/${name}.${format}.${min ? 'min.' : ''}js`,
      format,
      banner,
      name,
    },
    plugins: [].concat(min && terser()),
    external: ['vue', 'vuex'],
  }
}


export default getConfig(process.env.TARGET)

