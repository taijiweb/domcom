var FuncModel;

export default FuncModel = class FuncModel extends Model {
  constructor(func) {
    super();
    this.func = func;
  }

  get() {
    return this.func();
  }

};
