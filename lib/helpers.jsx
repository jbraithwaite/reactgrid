var _ = require('underscore');
var exportThis = {};

exportThis.lpad = function lpad(str, length, padstr) {
  var paddingLen = length - (str + '').length;
  paddingLen =  paddingLen < 0 ? 0 : paddingLen;
  var padding = '';
  for (var i = 0; i < paddingLen; i++) {
    padding = padding + padstr;
  }
  return padding + str;
}

// Extend taken from Backbone.js
// (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://backbonejs.org
exportThis.extend = function(staticProps, protoProps) {
  var parent = this;
  var child = {};

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  return child;
};

module.exports = exportThis;
