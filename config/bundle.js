const rollup = require('rollup')

module.exports = { build, buildEntry, watchEntry }

function build (entries) {
  let built = 0
  const total = entries.length
  const next = () => {
    buildEntry(entries[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }
  next()
}

async function buildEntry (config) {
  // const isProd = /min\.js$/.test(config.output.file)
  const bundle = await rollup.rollup(config)
  await bundle.generate(config)
  await bundle.write(config);
  // console.log(blue(code));
  // console.dir(generate.output);
  // if (!isProd) return write(config.output.file, code)
  // const minified = (config.output.banner ? config.output.banner + '\n' : '') + code
  // return write(config.output.file, minified)
}

async function watchEntry (config) {
  const watcher = await rollup.watch(config)
  watcher.on('event', event => {
    console.log(event.code);
    if(event.code === 'ERROR') {
      console.log(event);
    }
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
  });
}


function logError (e) {
  console.log(e)
}