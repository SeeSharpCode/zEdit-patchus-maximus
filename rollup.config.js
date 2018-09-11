import copy from 'rollup-plugin-copy';

export default {
    input: 'index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        strict: false
    },
    plugins: [
        copy({
            "partials": "dist/partials",
            "config": "dist/config",
            "module.json": "dist/module.json"
        }),
        copy({
            "dist": "../zEdit_Alpha_v0.4.3/modules/patchusMaximus"
        })
    ]
}