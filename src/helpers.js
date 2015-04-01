_ = require('underscore');

exports.lpad = function lpad(str, length, padstr) {
  var paddingLen = length - (str + '').length;
  paddingLen =  paddingLen < 0 ? 0 : paddingLen;
  var padding = '';
  for (var i = 0; i < paddingLen; i++) {
    padding = padding + padstr;
  }
  return padding + str;
};

exports.extend = function(staticProps, protoProps) {
  var parent = this;
  var child = {};

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  return child;
};

