var PropsModel,
  hasProp = {}.hasOwnProperty;

export default PropsModel = class PropsModel extends Model {
  constructor(props) {
    super();
    this.props = props;
  }

  get() {}

  setComponent(omponent) {
    var key, ref, value;
    this.omponent = omponent;
    ref = this.props;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      value = ref[key];
      if (value instanceof Model) {
        value.setComponent(component);
      }
    }
    return this;
  }

};
