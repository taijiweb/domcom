exports.renderMode = {
  UNDEFINED: undefined # domcom select the proper method to update dom according the component
  REPLACE: 1 # replace the original dom element
  PATCH_DYNAMIC: 2 # patch only dynamic properties, keep mind the source component and the target component has the same structure and the same static content
  PATCH_ALL: 3 # patch all cached properties
  #KEEP: 4 # keep the node in dom not changing
}