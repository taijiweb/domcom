var View;

import Emitter from '../Emitter';

export default View = class View extends Emitter {
  constructor(component) {
    super();
    this.component = component;
  }

};
