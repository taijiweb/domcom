
var requireReload = function(file) {
  if(require.resolve(file)) {
    delete require.cache[require.resolve(file)];
  }
  return require(file);
}

module.exports = requireReload;