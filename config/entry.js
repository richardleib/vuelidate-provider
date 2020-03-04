const replace = require('rollup-plugin-replace')
const buble = require('rollup-plugin-buble')
const banner = require('./banner')
const pack = require('../package.json')
const VuePlugin = require('rollup-plugin-vue')
const node = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const terser = require('rollup-plugin-terser').terser;


const entries = {
  commonjs: {
    input: 'src/index.js',
    output: {
      file: `dist/vuelidate-provider.common.js`,
      name: 'VuelidateProvider',
      format: 'cjs'
    },
    external: ['@d_hristov/get-value']
  },
  esm: {
    input: 'src/index.js',
    output: {
      file: `dist/vuelidate-provider.esm.js`,
      name: 'VuelidateProvider',
      format: 'es'
    },
    external: ['@d_hristov/get-value']
  },
  production: {
    input: 'src/index.js',
    output: {
      file: `dist/vuelidate-provider.min.js`,
      name: 'VuelidateProvider',
      format: 'umd',
      plugins: [terser()]
    },
    env: 'production'
  },
  development: {
    input: 'src/index.js',
    output: {
      file: `dist/vuelidate-provider.js`,
      name: 'VuelidateProvider',
      format: 'iife'
    },
    env: 'development'
  }
}

function genConfig (opts) {
  const config = {
    input: opts.input,
    output: {
      ...opts.output,
      banner,
      exports: 'named'
    },
    plugins: [
      node({
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      commonjs(),
      VuePlugin(),
      buble({
        transforms: { dangerousForOf: true },
        objectAssign: 'Object.assign'
      })
    ],
    external: opts.external
  }

  const replacePluginOptions = { '__VERSION__': pack.version }
  if (opts.env) {
    replacePluginOptions['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(replacePluginOptions))

  return config
}

exports.getEntry = name => genConfig(entries[name])
exports.getAllEntries = () => Object.keys(entries).map(name => genConfig(entries[name]))