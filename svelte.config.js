module.exports = {
  preprocess: require('svelte-preprocess')({
    // ...svelte-preprocess options
  }),
  // ...other svelte options
  emitCss: true,
  hotReload: true,
};