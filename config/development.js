const fs = require('fs')
const exist = fs.existsSync
const mkdir = fs.mkdirSync
const html = require('@rollup/plugin-html');
const replace = require('@rollup/plugin-replace')
const getEntry = require('./entry').getEntry
const watchEntry = require('./bundle').watchEntry

if (!exist('dist')) {
  mkdir('dist')
}

let entry = getEntry('development')

entry.input = 'test/dev/index.js'

if(!entry.plugins) {
  entry.plugins = [];
}
entry.plugins.push(html({
  template: async ({ attributes, files, publicPath, title }) => {
    const scripts = (files.js || [])
      .map(({ fileName }) => {
        const attrs = html.makeHtmlAttributes(attributes.script);
        return `<script src="${publicPath}${fileName}"${attrs}></script>`;
      })
      .join('\n');

    const links = (files.css || [])
      .map(({ fileName }) => {
        const attrs = html.makeHtmlAttributes(attributes.link);
        return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
      })
      .join('\n');

    return `
<!doctype html>
<html${html.makeHtmlAttributes(attributes.html)}>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    ${links}
  </head>
  <body>
    <div id="app"></div>
    ${scripts}
  </body>
</html>`;
  }
}));
entry.plugins.push(replace({
  'process.env.BUILD': JSON.stringify('lib')
}));

watchEntry(entry)
