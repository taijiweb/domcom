import Backend from './Backend'
export default class React extends Backend
  name: 'React'
  constructor: () ->
    super()
    # 增加用于引用React Tag标签的属性，以创建React基本标签部件
    # 如dcreact.div

module.exports = React

  