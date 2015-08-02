exports.operationConstant = {
CREATE_ELEMENT: 1
CREATE_TEXT: 2
UPDATE_TEXT: 3
CREATE_COMMENT: 4
UPDATE_COMMENT: 5
CREATE_PROPS: 6
UPDATE_PROPS: 7
CREATE_PROP: 18
UPDATE_PROP:  19
UPDATE_STYLE:  24
CREATE_EVENT: 8
UPDATE_EVENT: 9
UPDATE_SPECIAL: 23
CREATE_EVENTS: 20
UPDATE_EVENTS: 21
UPDATE_SPECIALS: 22,
UPDATE_STYLES: 11
APPEND_CHILD: 12
INSERT_CHILD: 13
CHILDREN: 14
CREATE_HTML: 15
UPDATE_HTML: 16
REMOVE_CHILD: 17
}
#24

exports.renderMode = {
  AUTO: undefined # according the component, automatically select the method to update dom
  REPLACE: 1 # replace the original dom element
  PATCH_ALL: 2 # patch all cached properties
  PATCH_DYNAMIC: 3 # patch only dynamic properties
  KEEP: 4 # keep the node in dom not changing
}