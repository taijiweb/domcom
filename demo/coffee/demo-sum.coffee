export default module.exports = () ->

  data = { a: 1, b: 2 }
  view = (data) ->
    props1 =
      value: data.a,
      onChange:(event) ->
        data.a = event.target.value*1
        comp.update()

    props2 =
      value: data.b,
      onChange: (event) ->
        data.b = event.target.value*1
        comp.update()

    return ['div',
            ['text', props1],
            ['text', props2],
            ['p', data.a + data.b]
          ]

  comp = dc({data, view})
