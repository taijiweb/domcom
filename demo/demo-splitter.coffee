{div} = dc

module.exports = ->
#  comp = div({style:{height:'100%', width:'100%'}, directives:splitter('vertical')},
#    div({style:{'background-color':"blue", width:'100%', height:'50%'}}, 1),
#    div({style:{'background-color':"green", width:'100%', height:'50%'}}, 2))

#  comp = div({style:{height:'100%', width:'100%'}, directives:splitter('horizontal'), x:1},
#    div({style:{'background-color':"blue", height:'50%', width:'50%', display:'inline-block'}}, 1),
#    div({style:{'background-color':"green", height:'50%', width:'50%', display:'inline-block'}}, 2))
  #comp = div({splitter:'vertical'}, div(1), div({splitter:'vertical'}, div(2), div(3)))     #horizontal

#  comp = div({style:{height:'100%',width:'100%'}, directives:splitter('horizontal')},
#    div({style:{'background-color':"blue", height:'100%',width:'200px'}},1),
#    div({style:{'background-color':"grey", height:'100%',width:'400px'}}, 2))

#  comp = div({directives:splitter('horizontal'), style:{height:'100%',width:'100%'}},
#    div({style:{'background-color':"blue", height:'100%'}}, 1),
#    div({directives:splitter('vertical'), style:{'background-color':"grey", height:'100%'}},
#      div(2), div(3)
#    ))

#  comp = div({horizontal: 'horizontal', style:{height:'100%',width:'100%'}},
#    div({style:{'background-color':"blue", width:'100%'}}, 1),
#    div({$splitter:'vertical', style:{'background-color':"grey", height:'100%', width:'100%'}},
#      div(2), div(3)
#    ))

  comp =div({$splitter:'vertical', style:{'background-color':"grey", height:'100%',width:'100%'}},
      div(2), div(3)
    )

  #comp.mount()