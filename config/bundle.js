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
  const bundle = await rollup.rollup(config)
  await bundle.generate(config)
  await bundle.write(config);
}

async function watchEntry (config) {
  const watcher = await rollup.watch(config)
  watcher.on('event', event => {
    console.log(event.code);
    if(event.code === 'ERROR') {
      console.log(event);
    }
  });
}


function logError (e) {
  console.log(e)
}
