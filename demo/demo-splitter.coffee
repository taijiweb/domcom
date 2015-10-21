{div} = dc

module.exports = ->
  dc.directives $splitter: dc.$splitter
  comp = div({$splitter:'vertical', style:{height:'100%',width:'100%'}},
    div({style:{'background-color':"blue", height:'50%',width:'100%'}}, 1),
    div({$splitter:'horizontal', style:{'background-color':"grey", height:'50%',width:'100%'}},
      div({style:{'background-color':"red", display:'inline-block', height:'100%',width:'40%'}}, 2),
      div({style:{'background-color':"green", display:'inline-block', height:'100%',width:'40%'}}, 3)
    ))

#  comp = div({$splitter: 'horizontal', style:{height:'100%',width:'100%'}},
#    div({style:{'background-color':"blue", display:'inline-block', height:'100%',width:'40%'}}, 1),
#    div({$splitter:'vertical', style:{'background-color':"grey", display:'inline-block',height:'100%', width:'50%'}},
#      div(2), div(3)
#    ))

#  comp = div({$splitter: 'horizontal', style:{height:'100%',width:'50%'}},
#    div({style:{'background-color':"blue", display:'inline-block', height:'100%',width:'40%'}}, 1),
#    div({style:{'background-color':"green", display:'inline-block', height:'100%',width:'40%'}}, 2)
#    )

#  comp =div({$splitter:'vertical', style:{'background-color':"grey", height:'100%',width:'100%'}},
#      div(2), div(3)
#    )

  #comp.mount()