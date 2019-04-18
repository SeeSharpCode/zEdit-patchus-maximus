import copy from 'rollup-plugin-copy';
import json from 'rollup-plugin-json';

export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    strict: false,
  },
  plugins: [
    json({
      namedExports: false,
      preferConst: true,
    }),
    copy({
      partials: 'dist/partials',
      config: 'dist/config',
      'module.json': 'dist/module.json',
    }),
    copy({
      dist: '../zEdit_v0.6.4_-_Portable_x64/modules/patchusMaximus',
    }),
  ],
};
