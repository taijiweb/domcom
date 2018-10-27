var FuncModel;

export default FuncModel = class FuncModel extends Model {
  constructor(object, path) {
    super();
    this.object = object;
    this.path = path;
    return this;
  }

  get() {
    return getValueAtPath(this.object, this.path);
  }

};
