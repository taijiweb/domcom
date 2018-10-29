import Angular from './Angular';

import Html from './Html';

import React from './React';

import Vue from './Vue';

export default {
  ng: function() {
    return new Angular();
  },
  html: function() {
    return new Html();
  },
  react: function() {
    return new React();
  },
  vue: function() {
    return new Vue();
  }
};
