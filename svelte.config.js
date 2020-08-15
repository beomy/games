const sveltePreprocess = require('svelte-preprocess');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  preprocess: sveltePreprocess({
    sourceMap: !prod
  }),
  // ...other svelte options
  emitCss: true,
  hotReload: true,
};