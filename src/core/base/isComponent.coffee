# do not try to use item instanceof Component again
# tried, but it will fail under the module system
# sometimes Component = require("path/to/Component")
# is not the same as in the original Component
module.exports = (item) -> item && item.renderDom?