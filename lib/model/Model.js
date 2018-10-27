/*
部件数据模型
  模型依据部件产生数据获取器
  模型有结构（有子特性和子域）
  模型可组合，但是不可直接计算，因而不可以有运算符方法
  如果有运算符方法是产生模型表达式结构而非获取器。
*/
var model;

export default model = class model {
  constructor(component, source, getter) {
    this.component = component;
    this.source = source;
    this.getter = getter;
  }

  get() {
    return this.getter(this.source);
  }

  compile() {}

  add() {}

  sub() {}

  mul() {}

  div() {}

  neg() {}

  not() {}

  and() {}

  or() {}

  not() {}

  bitand() {}

  bitor() {}

  bitnot() {}

  mod() {}

};
