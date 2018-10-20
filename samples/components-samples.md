# dc部件示例

    dc.from(model).to(template)
    dc(template, model)
    dc(div(at.split('x y'), {x, y})
    dc(div([at('x'), at('y'])

     dc(list.span(at.all), {x, y, z})
     dc(list.of('span')(at.all), {x, y, z}
     list.of(Tree)({data:at('tree')}), {tree})
     list.of('span')([1,2,3])

     model = {classes, styles}
     dc(div(model), model)
     dc(div(at(model), at(model))