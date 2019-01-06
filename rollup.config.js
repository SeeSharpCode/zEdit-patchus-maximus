import copy from 'rollup-plugin-copy';
import json from 'rollup-plugin-json';

export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    strict: false
  },
  plugins: [
    json({
      namedExports: false,
      preferConst: true
    }),
    copy({
      "partials": "dist/partials",
      "config": "dist/config",
      "module.json": "dist/module.json"
    }),
    copy({
      "dist": "../zEdit_Alpha_v0.5.3/modules/patchusMaximus"
    })
  ]
}