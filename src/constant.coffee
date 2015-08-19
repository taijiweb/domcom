exports.renderMode = {
  AUTO: undefined # according the component, automatically select the method to update dom
  REPLACE: 1 # replace the original dom element
  PATCH_ALL: 2 # patch all cached properties
  PATCH_DYNAMIC: 3 # patch only dynamic properties
  KEEP: 4 # keep the node in dom not changing
}