module.exports = {
  mode: 'maybe',
  entry: './the-entry.js',   // does not exist
  output: { filename: 'bundle.js', path: '/somewhere' },
  module: { rules: [ /* rules? in this economy */ ] }
};
