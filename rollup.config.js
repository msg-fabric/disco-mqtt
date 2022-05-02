import {builtinModules} from 'module'
import rpi_jsy from 'rollup-plugin-jsy'
import rpi_dgnotify from 'rollup-plugin-dgnotify'
import rpi_resolve from '@rollup/plugin-node-resolve'
import { terser as rpi_terser } from 'rollup-plugin-terser'


const _rpis_ = (defines, ...args) => [
  rpi_jsy({defines}),
  rpi_resolve(),
  ...args,
  // rpi_commonjs(), // Allow CommonJS use -- https://github.com/rollup/plugins/tree/master/packages/commonjs#readme
  rpi_dgnotify()]


const _cfg_ = {
  external: id => /^\w+:/.test(id) || builtinModules.includes(id),
  plugins: _rpis_({}) }

const _cfg_nodejs_ = { ..._cfg_,
  plugins: _rpis_({PLAT_NODEJS: true, HAS_STREAM: true}) }

const _cfg_deno_ = { ..._cfg_,
  plugins: _rpis_({PLAT_DENO: true}) }

const _cfg_web_ = { ..._cfg_,
  plugins: _rpis_({PLAT_WEB: true}) }

let is_watch = process.argv.includes('--watch')
const _cfg_web_min_ = is_watch && { ... _cfg_web_,
  plugins: _rpis_({PLAT_WEB: true}, rpi_terser()) }


export default [
  ... add_jsy('index'),
  ... add_jsy('core'),
  ... add_jsy('v4', {plat:true}),
  ... add_jsy('v5', {plat:true}),
  ... add_jsy('opaque/index'),
  ... add_jsy('opaque/v4', {plat:true}),
  ... add_jsy('opaque/v5', {plat:true}),
]



function * add_jsy(src_name, opt={}) {
  let {plat} = opt
  const input = `code/${src_name}${opt.ext || '.jsy'}`
  const out_name = src_name.replace(/\/index$/,'').replace(/[\/]/g, '_')

  if (! plat)
    yield { ... _cfg_, input,
      output: { file: `esm/${out_name}.js`, format: 'es', sourcemap: true }}

  if (plat && _cfg_nodejs_)
    yield { ... _cfg_nodejs_, input,
      output: { file: `esm/node/${out_name}.js`, format: 'es', sourcemap: true }}

  if (plat && _cfg_deno_)
    yield { ... _cfg_deno_, input,
      output: { file: `esm/deno/${out_name}.js`, format: 'es', sourcemap: true }}

  if (plat && _cfg_web_)
    yield { ... _cfg_web_, input,
      output: { file: `esm/web/${out_name}.js`, format: 'es', sourcemap: true }}

  if (_cfg_web_min_)
    yield { ... _cfg_web_min_, input,
      output: { file: plat ? `esm/web/${out_name}.min.js` : `esm/${out_name}.min.js`, format: 'es', sourcemap: false }}
}

