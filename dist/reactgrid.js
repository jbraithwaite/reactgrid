!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Reactgrid=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Cell      = require('./cell.jsx');
var Table     = require('./table.jsx');
var Formatter = require('./formatter.jsx');

module.exports = {
  Table     : Table,
  Formatter : Formatter,
  Cell      : Cell
};

},{"./cell.jsx":2,"./formatter.jsx":3,"./table.jsx":6}],2:[function(require,module,exports){
/** @jsx React.DOM */

// Try catch because of an issue with browserify
// https://github.com/paulmillr/exoskeleton/issues/60
try { _ = require('underscore'); } catch(e) { };
var Formatter = require('./formatter.jsx');
var Helpers = require('./helpers.jsx');
var extend = Helpers.extend;
var exportThis = {};

var HeaderCell = exportThis.HeaderCell = {
  render: function() {
    return (React.createElement("th", null, this.props.children));
  }
};

var Cell = exportThis.Cell = {

  getDefaultProps: function() {
    return {
      model: {},
      column: {},
      className: 'cell',
      formatter: Formatter.CellFormatter
    };
  },

  _updateFormatter : function(){
    var formatter = this.props.column.formatter || this.props.formatter;

    if (!_.isFunction(formatter.fromRaw) && !_.isFunction(formatter.toRaw)) {
      formatter = new formatter();
    }

    this.formatter = formatter;
  },

  render: function() {
    // Make sure this.formatter is a usable function.
    this._updateFormatter();

    var model = this.props.model;
    var column = this.props.column;
    var rawData = _.result(model, column.name);

    var value = this.formatter.fromRaw(rawData, this.props.model);
    return (React.createElement("td", {className: this.props.className}, value));
  }
};

/**
 * NumberCell is a generic cell that renders all numbers.
 * Numbers are formatted using a Backgrid.NumberFormatter.
 */
var NumberCell = exportThis.NumberCell = {};

_.extend(NumberCell, Cell, {
  getDefaultProps: function() {
    return {
      model: {},
      column: {},
      className: 'number-cell',
      formatter: Formatter.NumberFormatter
    };
  },

  getInitialState: function(){
    return {
      decimals: Formatter.NumberFormatter.prototype.defaults.decimals,
      decimalSeparator: Formatter.NumberFormatter.prototype.defaults.decimalSeparator,
      orderSeparator: Formatter.NumberFormatter.prototype.defaults.orderSeparator
    }
  },

  render: function() {
    // Make sure this.formatter is a usable function.
    this._updateFormatter();

    this.formatter.decimals = this.state.decimals;
    this.formatter.decimalSeparator = this.state.decimalSeparator;
    this.formatter.orderSeparator = this.state.orderSeparator;

    var model = this.props.model;
    var column = this.props.column;
    var rawData = _.result(model, column.name);

    var value = this.formatter.fromRaw(rawData, this.props.model);
    return (React.createElement("td", {className: this.props.className}, value));
  }
});

/**
 * StringCell displays HTML escaped strings and accepts anything typed in.
 */
var StringCell = exportThis.StringCell = {};

_.extend(StringCell, Cell, {
  getDefaultProps: function() {
    return {
      model: {},
      column: {},
      className: 'string-cell',
      formatter: Formatter.StringFormatter
    };
  }
});

/**
   UriCell renders an HTML `<a>` anchor for the value and accepts URIs as user
   input values. No type conversion or URL validation is done by the formatter
   of this cell. Users who need URL validation are encourage to subclass UriCell
   to take advantage of the parsing capabilities of the HTMLAnchorElement
   available on HTML5-capable browsers or using a third-party library like
   [URI.js](https://github.com/medialize/URI.js).
*/
var UriCell = exportThis.UriCell = {};

_.extend(UriCell, Cell, {
  getDefaultProps: function() {
    return {
      model: {},
      column: {},
      className: 'uri-cell',
      formatter: Formatter.CellFormatter
    };
  },

  getInitialState: function() {
    return {
      title: null,
      target: "_blank"
    }
  },

  render: function() {
    // Make sure this.formatter is a usable function.
    this._updateFormatter();

    var model = this.props.model;
    var column = this.props.column;
    var rawData = _.result(model, column.name);

    var formattedValue = this.formatter.fromRaw(rawData, this.props.model);
    var title = this.state.title || formattedValue;

    var value = (
      React.createElement("a", {
        href: formattedValue, 
        title: title, 
        target: this.state.target, 
        tabIndex: "-1"}, 
        formattedValue
      )
    );

    return (React.createElement("td", {className: this.props.className}, value));
  }

});


/**
   Like Backgrid.UriCell, EmailCell renders an HTML `<a>` anchor for the
   value. The `href` in the anchor is prefixed with `mailto:`. EmailCell will
   complain if the user enters a string that doesn't contain the `@` sign.
*/
var EmailCell = exportThis.EmailCell = {};

_.extend(EmailCell, StringCell, {
  getDefaultProps: function() {
    return {
      model: {},
      column: {},
      className: 'email-cell',
      formatter: Formatter.EmailFormatter
    };
  },

  render: function() {
    // Make sure this.formatter is a usable function.
    this._updateFormatter();

    var model = this.props.model;
    var column = this.props.column;
    var rawData = _.result(model, column.name);

    var formattedValue = this.formatter.fromRaw(rawData, this.props.model);

    var value = (
      React.createElement("a", {
        href: 'mailto:'+formattedValue, 
        title: formattedValue, 
        tabIndex: "-1"}, 
        formattedValue
      )
    );

    return (React.createElement("td", {className: this.props.className}, value));
  }
});

/**
   An IntegerCell is just a Backgrid.NumberCell with 0 decimals. If a floating
   point number is supplied, the number is simply rounded the usual way when
   displayed.
*/
var IntegerCell = exportThis.IntegerCell = {};

_.extend(IntegerCell, NumberCell, {
  getDefaultProps: function() {
    return {
      model: {},
      column: {},
      className: 'integer-cell',
      formatter: Formatter.NumberFormatter
    };
  },

  getInitialState: function(){
    return {
      decimals: 0,
      decimalSeparator: Formatter.NumberFormatter.prototype.defaults.decimalSeparator,
      orderSeparator: Formatter.NumberFormatter.prototype.defaults.orderSeparator
    }
  },
});

/**
 * A PercentCell is another Backgrid.NumberCell that takes a floating number,
 * optionally multiplied by a multiplier and display it as a percentage.
 */
var PercentCell = exportThis.PercentCell = {};

_.extend(PercentCell, NumberCell, {
 getDefaultProps: function() {
   return {
     model: {},
     column: {},
     className: 'percent-cell',
     formatter: Formatter.PercentFormatter
   };
 },

 getInitialState: function(){
   return {
     multiplier: Formatter.PercentFormatter.prototype.defaults.multiplier,
     symbol: Formatter.PercentFormatter.prototype.defaults.symbol,
   }
 }
});

/**
   DatetimeCell is a basic cell that accepts datetime string values in RFC-2822
   or W3C's subset of ISO-8601 and displays them in ISO-8601 format. For a much
   more sophisticated date time cell with better datetime formatting, take a
   look at the Backgrid.Extension.MomentCell extension.
*/
var DatetimeCell = exportThis.DatetimeCell = {};
_.extend(DatetimeCell, Cell, {
  getDefaultProps: function() {
   return {
     model: {},
     column: {},
     className: 'datetime-cell',
     formatter: Formatter.DatetimeFormatter
   };
  },

  getInitialState: function(){
   return {
     includeDate: Formatter.DatetimeFormatter.prototype.defaults.includeDate,
     includeTime: Formatter.DatetimeFormatter.prototype.defaults.includeTime,
     includeMilli: Formatter.DatetimeFormatter.prototype.defaults.includeMilli,
   }
  },

  render: function() {
    // Make sure this.formatter is a usable function.
    this._updateFormatter();

    this.formatter.includeDate = this.state.includeDate;
    this.formatter.includeTime = this.state.includeTime;
    this.formatter.includeMilli = this.state.includeMilli;

    var model = this.props.model;
    var column = this.props.column;
    var rawData = _.result(model, column.name);

    var value = this.formatter.fromRaw(rawData, this.props.model);
    return (React.createElement("td", {className: this.props.className}, value));
  }

});

/**
   DateCell is a Backgrid.DatetimeCell without the time part.
*/
var DateCell = exportThis.DateCell = {};
_.extend(DateCell, DatetimeCell, {
 getDefaultProps: function() {
   return {
     model: {},
     column: {},
     className: 'date-cell',
     formatter: Formatter.DatetimeFormatter
   };
 },

 getInitialState: function(){
   return {
     includeDate: Formatter.DatetimeFormatter.prototype.defaults.includeDate,
     includeTime: false,
     includeMilli: Formatter.DatetimeFormatter.prototype.defaults.includeMilli,
   }
 }
});

/**
   TimeCell is a Backgrid.DatetimeCell without the date part.

   @class Backgrid.TimeCell
   @extends Backgrid.DatetimeCell
*/
var TimeCell = exportThis.TimeCell = {};
_.extend(TimeCell, DatetimeCell, {
 getDefaultProps: function() {
   return {
     model: {},
     column: {},
     className: 'time-cell',
     formatter: Formatter.DatetimeFormatter
   };
 },

 getInitialState: function(){
   return {
     includeDate: false,
     includeTime: Formatter.DatetimeFormatter.prototype.defaults.includeTime,
     includeMilli: Formatter.DatetimeFormatter.prototype.defaults.includeMilli,
   }
 }
});

/**
 * BooleanCell renders a checkbox both during display mode and edit mode.
 * The checkbox is checked if the model value is true, unchecked otherwise.
*/
var BooleanCell = exportThis.BooleanCell = {};
_.extend(BooleanCell, Cell, {
  getDefaultProps: function() {
   return {
     model: {},
     column: {},
     className: 'boolean-cell',
     formatter: Formatter.CellFormatter
   };
  },

  render: function() {
    // Make sure this.formatter is a usable function.
    this._updateFormatter();

    var model = this.props.model;
    var column = this.props.column;
    var rawData = _.result(model, column.name);

    var formattedValue = this.formatter.fromRaw(rawData, this.props.model);
    var value = (
      React.createElement("input", {type: "checkbox", tabIndex: "-1", checked: formattedValue, disabled: true})
    );
    return (React.createElement("td", {className: this.props.className}, value));
  }
});

/**
   SelectCell is also a different kind of cell in that upon going into edit mode
   the cell renders a list of options to pick from, as opposed to an input box.

   SelectCell cannot be referenced by its string name when used in a column
   definition because it requires an `optionValues` class attribute to be
   defined. `optionValues` can either be a list of name-value pairs, to be
   rendered as options, or a list of object hashes which consist of a key *name*
   which is the option group name, and a key *values* which is a list of
   name-value pairs to be rendered as options under that option group.

   In addition, `optionValues` can also be a parameter-less function that
   returns one of the above. If the options are static, it is recommended the
   returned values to be memoized. `_.memoize()` is a good function to help with
   that.

   During display mode, the default formatter will normalize the raw model value
   to an array of values whether the raw model value is a scalar or an
   array. Each value is compared with the `optionValues` values using
   Ecmascript's implicit type conversion rules. When exiting edit mode, no type
   conversion is performed when saving into the model. This behavior is not
   always desirable when the value type is anything other than string. To
   control type conversion on the client-side, you should subclass SelectCell to
   provide a custom formatter or provide the formatter to your column
   definition.

   See:
     [$.fn.val()](http://api.jquery.com/val/)

   @class Backgrid.SelectCell
   @extends Backgrid.Cell
*/
var SelectCell = exportThis.SelectCell = {};
_.extend(SelectCell, Cell, {
 getDefaultProps: function() {
   return {
     model: {},
     column: {},
     className: 'select-cell',
     formatter: Formatter.SelectFormatter
   };
 },

 getInitialState: function(){
   return {
     multiple: false,
     optionValues: undefined,
     delimiter: ', ',
   }
 },

 render: function() {
    // Make sure this.formatter is a usable function.
    this._updateFormatter();

    var model = this.props.model;
    var column = this.props.column;
    var modelData = _.result(model, column.name);
    var value = '';

    var rawData = this.formatter.fromRaw(modelData, this.props.model);

    var optionValues = _.result(this.state, "optionValues");

    var selectedText = [];

    try {
      if (!_.isArray(optionValues) || _.isEmpty(optionValues)) throw new TypeError;

      for (var k = 0; k < rawData.length; k++) {
        var rawDatum = rawData[k];

        for (var i = 0; i < optionValues.length; i++) {
          var optionValue = optionValues[i];

          if (_.isArray(optionValue)) {
            var optionText  = optionValue[0];
            var optionValue = optionValue[1];

            if (optionValue == rawDatum) selectedText.push(optionText);
          }
          else if (_.isObject(optionValue)) {
            var optionGroupValues = optionValue.values;

            for (var j = 0; j < optionGroupValues.length; j++) {
              var optionGroupValue = optionGroupValues[j];
              if (optionGroupValue[1] == rawDatum) {
                selectedText.push(optionGroupValue[0]);
              }
            }
          }
          else {
            throw new TypeError;
          }
        }
      }

      value = selectedText.join(this.delimiter);
    }
    catch (ex) {
      if (ex instanceof TypeError) {
        throw new TypeError("'optionValues' must be of type {Array.<Array>|Array.<{name: string, values: Array.<Array>}>}");
      }
      throw ex;
    }

    return (
      React.createElement("td", {className: this.props.className}, value)
    );

  }
});

_.each(exportThis, function(singleCell, key){
  exportThis[key].extend = extend;
  exportThis[key + 'Class'] = React.createClass(singleCell);
});

module.exports = exportThis;

},{"./formatter.jsx":3,"./helpers.jsx":4,"underscore":undefined}],3:[function(require,module,exports){
/** @jsx React.DOM */

// Try catch because of an issue with browserify
// https://github.com/paulmillr/exoskeleton/issues/60
try { _ = require('underscore'); } catch(e) { };
var Helpers = require('./helpers.jsx');
var extend = Helpers.extend;
var lpad = Helpers.lpad;

var exportThis = {};

// Cell
// ------------------------------------------------------------------
var CellFormatter = exportThis.CellFormatter = function() {};

_.extend(CellFormatter.prototype, {
  fromRaw: function(rawData, model){
    return rawData;
  },

  toRaw: function(formattedData, model){
    return 9;
  }
});

// Number
// ------------------------------------------------------------------
var NumberFormatter = exportThis.NumberFormatter = function(options){
  _.extend(this, this.defaults, options || {});

  if (this.decimals < 0 || this.decimals > 20) {
    throw new RangeError("decimals must be between 0 and 20");
  }
};

NumberFormatter.prototype = new CellFormatter();

_.extend(NumberFormatter.prototype, {

  defaults: {
    decimals: 2,
    decimalSeparator: '.',
    orderSeparator: ','
  },

  HUMANIZED_NUM_RE: /(\d)(?=(?:\d{3})+$)/g,

  fromRaw: function (number, model) {

    if (_.isNull(number) || _.isUndefined(number)) return '';

    number = number.toFixed(~~this.decimals);

    var parts = number.split('.');
    var integerPart = parts[0];
    var decimalPart = parts[1] ? (this.decimalSeparator || '.') + parts[1] : '';

    return integerPart.replace(this.HUMANIZED_NUM_RE, '$1' + this.orderSeparator) + decimalPart;
  },

  toRaw: function (formattedData, model) {

    formattedData = formattedData.trim();

    if (formattedData === '') return null;

    var rawData = '';

    var thousands = formattedData.split(this.orderSeparator);
    for (var i = 0; i < thousands.length; i++) {
      rawData += thousands[i];
    }

    var decimalParts = rawData.split(this.decimalSeparator);
    rawData = '';
    for (var i = 0; i < decimalParts.length; i++) {
      rawData = rawData + decimalParts[i] + '.';
    }

    if (rawData[rawData.length - 1] === '.') {
      rawData = rawData.slice(0, rawData.length - 1);
    }

    var result = (rawData * 1).toFixed(~~this.decimals) * 1;
    if (_.isNumber(result) && !_.isNaN(result)) return result;
  }


});

// Percent
// ------------------------------------------------------------------
var PercentFormatter = exportThis.PercentFormatter = function () {
  NumberFormatter.apply(this, arguments);
};

PercentFormatter.prototype = new NumberFormatter(),

_.extend(PercentFormatter.prototype, {

  defaults: _.extend({}, NumberFormatter.prototype.defaults, {
    multiplier: 1,
    symbol: "%"
  }),

  fromRaw: function (number, model) {
    var args = [].slice.call(arguments, 1);
    args.unshift(number * this.multiplier);
    return (NumberFormatter.prototype.fromRaw.apply(this, args) || "0") + this.symbol;
  },

  toRaw: function (formattedValue, model) {
    var tokens = formattedValue.split(this.symbol);
    if (tokens && tokens[0] && tokens[1] === "" || tokens[1] == null) {
      var rawValue = NumberFormatter.prototype.toRaw.call(this, tokens[0]);
      if (_.isUndefined(rawValue)) return rawValue;
      return rawValue / this.multiplier;
    }
  }

});

// Date
// ------------------------------------------------------------------
var DatetimeFormatter = exportThis.DatetimeFormatter = function (options) {
  _.extend(this, this.defaults, options || {});

  if (!this.includeDate && !this.includeTime) {
    throw new Error("Either includeDate or includeTime must be true");
  }
};
DatetimeFormatter.prototype = new CellFormatter();
_.extend(DatetimeFormatter.prototype, {

  defaults: {
    includeDate: true,
    includeTime: true,
    includeMilli: false
  },

  DATE_RE: /^([+\-]?\d{4})-(\d{2})-(\d{2})$/,
  TIME_RE: /^(\d{2}):(\d{2}):(\d{2})(\.(\d{3}))?$/,
  ISO_SPLITTER_RE: /T|Z| +/,

  _convert: function (data, validate) {
    if ((data + '').trim() === '') return null;

    var date, time = null;
    if (_.isNumber(data)) {
      var jsDate = new Date(data);
      date = lpad(jsDate.getUTCFullYear(), 4, 0) + '-' + lpad(jsDate.getUTCMonth() + 1, 2, 0) + '-' + lpad(jsDate.getUTCDate(), 2, 0);
      time = lpad(jsDate.getUTCHours(), 2, 0) + ':' + lpad(jsDate.getUTCMinutes(), 2, 0) + ':' + lpad(jsDate.getUTCSeconds(), 2, 0);
    }
    else {
      data = data.trim();
      var parts = data.split(this.ISO_SPLITTER_RE) || [];
      date = this.DATE_RE.test(parts[0]) ? parts[0] : '';
      time = date && parts[1] ? parts[1] : this.TIME_RE.test(parts[0]) ? parts[0] : '';
    }

    var YYYYMMDD = this.DATE_RE.exec(date) || [];
    var HHmmssSSS = this.TIME_RE.exec(time) || [];

    if (validate) {
      if (this.includeDate && _.isUndefined(YYYYMMDD[0])) return;
      if (this.includeTime && _.isUndefined(HHmmssSSS[0])) return;
      if (!this.includeDate && date) return;
      if (!this.includeTime && time) return;
    }

    var jsDate = new Date(Date.UTC(YYYYMMDD[1] * 1 || 0,
                                   YYYYMMDD[2] * 1 - 1 || 0,
                                   YYYYMMDD[3] * 1 || 0,
                                   HHmmssSSS[1] * 1 || null,
                                   HHmmssSSS[2] * 1 || null,
                                   HHmmssSSS[3] * 1 || null,
                                   HHmmssSSS[5] * 1 || null));

    var result = '';

    if (this.includeDate) {
      result = lpad(jsDate.getUTCFullYear(), 4, 0) + '-' + lpad(jsDate.getUTCMonth() + 1, 2, 0) + '-' + lpad(jsDate.getUTCDate(), 2, 0);
    }

    if (this.includeTime) {
      result = result + (this.includeDate ? 'T' : '') + lpad(jsDate.getUTCHours(), 2, 0) + ':' + lpad(jsDate.getUTCMinutes(), 2, 0) + ':' + lpad(jsDate.getUTCSeconds(), 2, 0);

      if (this.includeMilli) {
        result = result + '.' + lpad(jsDate.getUTCMilliseconds(), 3, 0);
      }
    }

    if (this.includeDate && this.includeTime) {
      result += "Z";
    }

    return result;
  },

  fromRaw: function (rawData, model) {
    if (_.isNull(rawData) || _.isUndefined(rawData)) return '';
    return this._convert(rawData);
  },

  toRaw: function (formattedData, model) {
    return this._convert(formattedData, true);
  }

});

// String
// ------------------------------------------------------------------
var StringFormatter = exportThis.StringFormatter = function () {};
StringFormatter.prototype = new CellFormatter();

_.extend(StringFormatter.prototype, {
  fromRaw: function (rawValue, model) {
    if (_.isUndefined(rawValue) || _.isNull(rawValue)) return '';
    return rawValue + '';
  }
});

// Email
// ------------------------------------------------------------------
var EmailFormatter = exportThis.EmailFormatter = function () {};
EmailFormatter.prototype = new CellFormatter();

_.extend(EmailFormatter.prototype, {

  toRaw: function (formattedData, model) {
    var parts = formattedData.trim().split("@");
    if (parts.length === 2 && _.all(parts)) {
      return formattedData;
    }
  }
});

// Select
// ------------------------------------------------------------------
var SelectFormatter = exportThis.SelectFormatter = function () {};
SelectFormatter.prototype = new CellFormatter();

_.extend(SelectFormatter.prototype, {

  fromRaw: function (rawValue, model) {
    return _.isArray(rawValue) ? rawValue : rawValue != null ? [rawValue] : [];
  }
});

_.each(exportThis, function(formatter, key){
  exportThis[key].extend = extend;
});

module.exports = exportThis;

},{"./helpers.jsx":4,"underscore":undefined}],4:[function(require,module,exports){
/** @jsx React.DOM */

// Try catch because of an issue with browserify
// https://github.com/paulmillr/exoskeleton/issues/60
try { _ = require('underscore'); } catch(e) { };

exports.lpad = function lpad(str, length, padstr) {
  var paddingLen = length - (str + '').length;
  paddingLen =  paddingLen < 0 ? 0 : paddingLen;
  var padding = '';
  for (var i = 0; i < paddingLen; i++) {
    padding = padding + padstr;
  }
  return padding + str;
}

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


},{"underscore":undefined}],5:[function(require,module,exports){
/** @jsx React.DOM */

var Row = React.createClass({displayName: "Row",

  render: function() {

    return (
      React.createElement("tr", null, 
        this.props.children
      )
    );
  }

});

module.exports = Row;

},{}],6:[function(require,module,exports){
/** @jsx React.DOM */

var Thead = require('./thead.jsx');
var Tbody = require('./tbody.jsx');

var Table = React.createClass({displayName: "Table",

  getDefaultProps: function() {
    return {
      columns: []
    };
  },

  render: function() {

    var table = (
      React.createElement("table", {className: this.props.className}, 
        React.createElement(Thead, {columns: this.props.columns}), 
        React.createElement(Tbody, {collection: this.props.collection, columns: this.props.columns})
      )
    );

    if(this.props.responsive) {
      return (
        React.createElement("div", {className: "table-responsive"}, 
          table
        )
      );
    } else {
      return table;
    }

  }
});

module.exports = Table;

},{"./tbody.jsx":7,"./thead.jsx":8}],7:[function(require,module,exports){
/** @jsx React.DOM */

// Try catch because of an issue with browserify
// https://github.com/paulmillr/exoskeleton/issues/60
try { _ = require('underscore'); } catch(e) { };
var Cells = require('./cell.jsx');
var Tr = require('./row.jsx');

var Tbody = React.createClass({displayName: "Tbody",
  render : function(){

    var allColumns = this.props.columns;
    var collection = this.props.collection;

    var rows = [];

    if (_.isEmpty(collection)) return (React.createElement("tbody", null));

    _.each(collection, function(model, keyCollection){
      var items = [];

      _.each(allColumns, function(column, keyColumn){
        var ComponentClass = Cells.CellClass;

        if (column.cell && typeof column.cell === 'string'){
          var theClassName = column.cell.charAt(0).toUpperCase() + column.cell.slice(1) + 'CellClass';
          ComponentClass = Cells[theClassName];
          if (typeof ComponentClass !== 'function'){
            throw new ReferenceError('[reactgrid] Unknown Class name: "'+column.cell+'"');
          }
        } else if (column.cell && typeof column.cell === 'function') {
          ComponentClass = column.cell;
        }
        items.push(React.createElement(ComponentClass, {model: model, column: column, key: keyColumn}) );
      });

      rows.push(React.createElement(Tr, {key: keyCollection}, items));
    });

    return (
      React.createElement("tbody", null, 
        rows
      )
    );
  }
});

module.exports = Tbody;

},{"./cell.jsx":2,"./row.jsx":5,"underscore":undefined}],8:[function(require,module,exports){
/** @jsx React.DOM */

// Try catch because of an issue with browserify
// https://github.com/paulmillr/exoskeleton/issues/60
try { _ = require('underscore'); } catch(e) { };
var Th = require('./cell.jsx').HeaderCellClass;

var Thead = React.createClass({displayName: "Thead",

  render: function(){
    var columns = [];

    _.each(this.props.columns, function(column, key){
      columns.push(React.createElement(Th, {key: key}, column.label));
    });

    return (
      React.createElement("thead", null, 
        React.createElement("tr", null, 
          columns
        )
      )
    );
  }
});

module.exports = Thead;

},{"./cell.jsx":2,"underscore":undefined}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvY2VsbC5qc3giLCJzcmMvZm9ybWF0dGVyLmpzeCIsInNyYy9oZWxwZXJzLmpzeCIsInNyYy9yb3cuanN4Iiwic3JjL3RhYmxlLmpzeCIsInNyYy90Ym9keS5qc3giLCJzcmMvdGhlYWQuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQ2VsbCAgICAgID0gcmVxdWlyZSgnLi9jZWxsLmpzeCcpO1xudmFyIFRhYmxlICAgICA9IHJlcXVpcmUoJy4vdGFibGUuanN4Jyk7XG52YXIgRm9ybWF0dGVyID0gcmVxdWlyZSgnLi9mb3JtYXR0ZXIuanN4Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBUYWJsZSAgICAgOiBUYWJsZSxcbiAgRm9ybWF0dGVyIDogRm9ybWF0dGVyLFxuICBDZWxsICAgICAgOiBDZWxsXG59O1xuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbi8vIFRyeSBjYXRjaCBiZWNhdXNlIG9mIGFuIGlzc3VlIHdpdGggYnJvd3NlcmlmeVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3BhdWxtaWxsci9leG9za2VsZXRvbi9pc3N1ZXMvNjBcbnRyeSB7IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7IH0gY2F0Y2goZSkgeyB9O1xudmFyIEZvcm1hdHRlciA9IHJlcXVpcmUoJy4vZm9ybWF0dGVyLmpzeCcpO1xudmFyIEhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMuanN4Jyk7XG52YXIgZXh0ZW5kID0gSGVscGVycy5leHRlbmQ7XG52YXIgZXhwb3J0VGhpcyA9IHt9O1xuXG52YXIgSGVhZGVyQ2VsbCA9IGV4cG9ydFRoaXMuSGVhZGVyQ2VsbCA9IHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiLCBudWxsLCB0aGlzLnByb3BzLmNoaWxkcmVuKSk7XG4gIH1cbn07XG5cbnZhciBDZWxsID0gZXhwb3J0VGhpcy5DZWxsID0ge1xuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiB7fSxcbiAgICAgIGNvbHVtbjoge30sXG4gICAgICBjbGFzc05hbWU6ICdjZWxsJyxcbiAgICAgIGZvcm1hdHRlcjogRm9ybWF0dGVyLkNlbGxGb3JtYXR0ZXJcbiAgICB9O1xuICB9LFxuXG4gIF91cGRhdGVGb3JtYXR0ZXIgOiBmdW5jdGlvbigpe1xuICAgIHZhciBmb3JtYXR0ZXIgPSB0aGlzLnByb3BzLmNvbHVtbi5mb3JtYXR0ZXIgfHwgdGhpcy5wcm9wcy5mb3JtYXR0ZXI7XG5cbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmb3JtYXR0ZXIuZnJvbVJhdykgJiYgIV8uaXNGdW5jdGlvbihmb3JtYXR0ZXIudG9SYXcpKSB7XG4gICAgICBmb3JtYXR0ZXIgPSBuZXcgZm9ybWF0dGVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5mb3JtYXR0ZXIgPSBmb3JtYXR0ZXI7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAvLyBNYWtlIHN1cmUgdGhpcy5mb3JtYXR0ZXIgaXMgYSB1c2FibGUgZnVuY3Rpb24uXG4gICAgdGhpcy5fdXBkYXRlRm9ybWF0dGVyKCk7XG5cbiAgICB2YXIgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuICAgIHZhciBjb2x1bW4gPSB0aGlzLnByb3BzLmNvbHVtbjtcbiAgICB2YXIgcmF3RGF0YSA9IF8ucmVzdWx0KG1vZGVsLCBjb2x1bW4ubmFtZSk7XG5cbiAgICB2YXIgdmFsdWUgPSB0aGlzLmZvcm1hdHRlci5mcm9tUmF3KHJhd0RhdGEsIHRoaXMucHJvcHMubW9kZWwpO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lfSwgdmFsdWUpKTtcbiAgfVxufTtcblxuLyoqXG4gKiBOdW1iZXJDZWxsIGlzIGEgZ2VuZXJpYyBjZWxsIHRoYXQgcmVuZGVycyBhbGwgbnVtYmVycy5cbiAqIE51bWJlcnMgYXJlIGZvcm1hdHRlZCB1c2luZyBhIEJhY2tncmlkLk51bWJlckZvcm1hdHRlci5cbiAqL1xudmFyIE51bWJlckNlbGwgPSBleHBvcnRUaGlzLk51bWJlckNlbGwgPSB7fTtcblxuXy5leHRlbmQoTnVtYmVyQ2VsbCwgQ2VsbCwge1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDoge30sXG4gICAgICBjb2x1bW46IHt9LFxuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyLWNlbGwnLFxuICAgICAgZm9ybWF0dGVyOiBGb3JtYXR0ZXIuTnVtYmVyRm9ybWF0dGVyXG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlY2ltYWxzOiBGb3JtYXR0ZXIuTnVtYmVyRm9ybWF0dGVyLnByb3RvdHlwZS5kZWZhdWx0cy5kZWNpbWFscyxcbiAgICAgIGRlY2ltYWxTZXBhcmF0b3I6IEZvcm1hdHRlci5OdW1iZXJGb3JtYXR0ZXIucHJvdG90eXBlLmRlZmF1bHRzLmRlY2ltYWxTZXBhcmF0b3IsXG4gICAgICBvcmRlclNlcGFyYXRvcjogRm9ybWF0dGVyLk51bWJlckZvcm1hdHRlci5wcm90b3R5cGUuZGVmYXVsdHMub3JkZXJTZXBhcmF0b3JcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAvLyBNYWtlIHN1cmUgdGhpcy5mb3JtYXR0ZXIgaXMgYSB1c2FibGUgZnVuY3Rpb24uXG4gICAgdGhpcy5fdXBkYXRlRm9ybWF0dGVyKCk7XG5cbiAgICB0aGlzLmZvcm1hdHRlci5kZWNpbWFscyA9IHRoaXMuc3RhdGUuZGVjaW1hbHM7XG4gICAgdGhpcy5mb3JtYXR0ZXIuZGVjaW1hbFNlcGFyYXRvciA9IHRoaXMuc3RhdGUuZGVjaW1hbFNlcGFyYXRvcjtcbiAgICB0aGlzLmZvcm1hdHRlci5vcmRlclNlcGFyYXRvciA9IHRoaXMuc3RhdGUub3JkZXJTZXBhcmF0b3I7XG5cbiAgICB2YXIgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuICAgIHZhciBjb2x1bW4gPSB0aGlzLnByb3BzLmNvbHVtbjtcbiAgICB2YXIgcmF3RGF0YSA9IF8ucmVzdWx0KG1vZGVsLCBjb2x1bW4ubmFtZSk7XG5cbiAgICB2YXIgdmFsdWUgPSB0aGlzLmZvcm1hdHRlci5mcm9tUmF3KHJhd0RhdGEsIHRoaXMucHJvcHMubW9kZWwpO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lfSwgdmFsdWUpKTtcbiAgfVxufSk7XG5cbi8qKlxuICogU3RyaW5nQ2VsbCBkaXNwbGF5cyBIVE1MIGVzY2FwZWQgc3RyaW5ncyBhbmQgYWNjZXB0cyBhbnl0aGluZyB0eXBlZCBpbi5cbiAqL1xudmFyIFN0cmluZ0NlbGwgPSBleHBvcnRUaGlzLlN0cmluZ0NlbGwgPSB7fTtcblxuXy5leHRlbmQoU3RyaW5nQ2VsbCwgQ2VsbCwge1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDoge30sXG4gICAgICBjb2x1bW46IHt9LFxuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nLWNlbGwnLFxuICAgICAgZm9ybWF0dGVyOiBGb3JtYXR0ZXIuU3RyaW5nRm9ybWF0dGVyXG4gICAgfTtcbiAgfVxufSk7XG5cbi8qKlxuICAgVXJpQ2VsbCByZW5kZXJzIGFuIEhUTUwgYDxhPmAgYW5jaG9yIGZvciB0aGUgdmFsdWUgYW5kIGFjY2VwdHMgVVJJcyBhcyB1c2VyXG4gICBpbnB1dCB2YWx1ZXMuIE5vIHR5cGUgY29udmVyc2lvbiBvciBVUkwgdmFsaWRhdGlvbiBpcyBkb25lIGJ5IHRoZSBmb3JtYXR0ZXJcbiAgIG9mIHRoaXMgY2VsbC4gVXNlcnMgd2hvIG5lZWQgVVJMIHZhbGlkYXRpb24gYXJlIGVuY291cmFnZSB0byBzdWJjbGFzcyBVcmlDZWxsXG4gICB0byB0YWtlIGFkdmFudGFnZSBvZiB0aGUgcGFyc2luZyBjYXBhYmlsaXRpZXMgb2YgdGhlIEhUTUxBbmNob3JFbGVtZW50XG4gICBhdmFpbGFibGUgb24gSFRNTDUtY2FwYWJsZSBicm93c2VycyBvciB1c2luZyBhIHRoaXJkLXBhcnR5IGxpYnJhcnkgbGlrZVxuICAgW1VSSS5qc10oaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMpLlxuKi9cbnZhciBVcmlDZWxsID0gZXhwb3J0VGhpcy5VcmlDZWxsID0ge307XG5cbl8uZXh0ZW5kKFVyaUNlbGwsIENlbGwsIHtcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IHt9LFxuICAgICAgY29sdW1uOiB7fSxcbiAgICAgIGNsYXNzTmFtZTogJ3VyaS1jZWxsJyxcbiAgICAgIGZvcm1hdHRlcjogRm9ybWF0dGVyLkNlbGxGb3JtYXR0ZXJcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgdGFyZ2V0OiBcIl9ibGFua1wiXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gTWFrZSBzdXJlIHRoaXMuZm9ybWF0dGVyIGlzIGEgdXNhYmxlIGZ1bmN0aW9uLlxuICAgIHRoaXMuX3VwZGF0ZUZvcm1hdHRlcigpO1xuXG4gICAgdmFyIG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcbiAgICB2YXIgY29sdW1uID0gdGhpcy5wcm9wcy5jb2x1bW47XG4gICAgdmFyIHJhd0RhdGEgPSBfLnJlc3VsdChtb2RlbCwgY29sdW1uLm5hbWUpO1xuXG4gICAgdmFyIGZvcm1hdHRlZFZhbHVlID0gdGhpcy5mb3JtYXR0ZXIuZnJvbVJhdyhyYXdEYXRhLCB0aGlzLnByb3BzLm1vZGVsKTtcbiAgICB2YXIgdGl0bGUgPSB0aGlzLnN0YXRlLnRpdGxlIHx8IGZvcm1hdHRlZFZhbHVlO1xuXG4gICAgdmFyIHZhbHVlID0gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1xuICAgICAgICBocmVmOiBmb3JtYXR0ZWRWYWx1ZSwgXG4gICAgICAgIHRpdGxlOiB0aXRsZSwgXG4gICAgICAgIHRhcmdldDogdGhpcy5zdGF0ZS50YXJnZXQsIFxuICAgICAgICB0YWJJbmRleDogXCItMVwifSwgXG4gICAgICAgIGZvcm1hdHRlZFZhbHVlXG4gICAgICApXG4gICAgKTtcblxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lfSwgdmFsdWUpKTtcbiAgfVxuXG59KTtcblxuXG4vKipcbiAgIExpa2UgQmFja2dyaWQuVXJpQ2VsbCwgRW1haWxDZWxsIHJlbmRlcnMgYW4gSFRNTCBgPGE+YCBhbmNob3IgZm9yIHRoZVxuICAgdmFsdWUuIFRoZSBgaHJlZmAgaW4gdGhlIGFuY2hvciBpcyBwcmVmaXhlZCB3aXRoIGBtYWlsdG86YC4gRW1haWxDZWxsIHdpbGxcbiAgIGNvbXBsYWluIGlmIHRoZSB1c2VyIGVudGVycyBhIHN0cmluZyB0aGF0IGRvZXNuJ3QgY29udGFpbiB0aGUgYEBgIHNpZ24uXG4qL1xudmFyIEVtYWlsQ2VsbCA9IGV4cG9ydFRoaXMuRW1haWxDZWxsID0ge307XG5cbl8uZXh0ZW5kKEVtYWlsQ2VsbCwgU3RyaW5nQ2VsbCwge1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDoge30sXG4gICAgICBjb2x1bW46IHt9LFxuICAgICAgY2xhc3NOYW1lOiAnZW1haWwtY2VsbCcsXG4gICAgICBmb3JtYXR0ZXI6IEZvcm1hdHRlci5FbWFpbEZvcm1hdHRlclxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAvLyBNYWtlIHN1cmUgdGhpcy5mb3JtYXR0ZXIgaXMgYSB1c2FibGUgZnVuY3Rpb24uXG4gICAgdGhpcy5fdXBkYXRlRm9ybWF0dGVyKCk7XG5cbiAgICB2YXIgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuICAgIHZhciBjb2x1bW4gPSB0aGlzLnByb3BzLmNvbHVtbjtcbiAgICB2YXIgcmF3RGF0YSA9IF8ucmVzdWx0KG1vZGVsLCBjb2x1bW4ubmFtZSk7XG5cbiAgICB2YXIgZm9ybWF0dGVkVmFsdWUgPSB0aGlzLmZvcm1hdHRlci5mcm9tUmF3KHJhd0RhdGEsIHRoaXMucHJvcHMubW9kZWwpO1xuXG4gICAgdmFyIHZhbHVlID0gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge1xuICAgICAgICBocmVmOiAnbWFpbHRvOicrZm9ybWF0dGVkVmFsdWUsIFxuICAgICAgICB0aXRsZTogZm9ybWF0dGVkVmFsdWUsIFxuICAgICAgICB0YWJJbmRleDogXCItMVwifSwgXG4gICAgICAgIGZvcm1hdHRlZFZhbHVlXG4gICAgICApXG4gICAgKTtcblxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lfSwgdmFsdWUpKTtcbiAgfVxufSk7XG5cbi8qKlxuICAgQW4gSW50ZWdlckNlbGwgaXMganVzdCBhIEJhY2tncmlkLk51bWJlckNlbGwgd2l0aCAwIGRlY2ltYWxzLiBJZiBhIGZsb2F0aW5nXG4gICBwb2ludCBudW1iZXIgaXMgc3VwcGxpZWQsIHRoZSBudW1iZXIgaXMgc2ltcGx5IHJvdW5kZWQgdGhlIHVzdWFsIHdheSB3aGVuXG4gICBkaXNwbGF5ZWQuXG4qL1xudmFyIEludGVnZXJDZWxsID0gZXhwb3J0VGhpcy5JbnRlZ2VyQ2VsbCA9IHt9O1xuXG5fLmV4dGVuZChJbnRlZ2VyQ2VsbCwgTnVtYmVyQ2VsbCwge1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDoge30sXG4gICAgICBjb2x1bW46IHt9LFxuICAgICAgY2xhc3NOYW1lOiAnaW50ZWdlci1jZWxsJyxcbiAgICAgIGZvcm1hdHRlcjogRm9ybWF0dGVyLk51bWJlckZvcm1hdHRlclxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7XG4gICAgICBkZWNpbWFsczogMCxcbiAgICAgIGRlY2ltYWxTZXBhcmF0b3I6IEZvcm1hdHRlci5OdW1iZXJGb3JtYXR0ZXIucHJvdG90eXBlLmRlZmF1bHRzLmRlY2ltYWxTZXBhcmF0b3IsXG4gICAgICBvcmRlclNlcGFyYXRvcjogRm9ybWF0dGVyLk51bWJlckZvcm1hdHRlci5wcm90b3R5cGUuZGVmYXVsdHMub3JkZXJTZXBhcmF0b3JcbiAgICB9XG4gIH0sXG59KTtcblxuLyoqXG4gKiBBIFBlcmNlbnRDZWxsIGlzIGFub3RoZXIgQmFja2dyaWQuTnVtYmVyQ2VsbCB0aGF0IHRha2VzIGEgZmxvYXRpbmcgbnVtYmVyLFxuICogb3B0aW9uYWxseSBtdWx0aXBsaWVkIGJ5IGEgbXVsdGlwbGllciBhbmQgZGlzcGxheSBpdCBhcyBhIHBlcmNlbnRhZ2UuXG4gKi9cbnZhciBQZXJjZW50Q2VsbCA9IGV4cG9ydFRoaXMuUGVyY2VudENlbGwgPSB7fTtcblxuXy5leHRlbmQoUGVyY2VudENlbGwsIE51bWJlckNlbGwsIHtcbiBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIHtcbiAgICAgbW9kZWw6IHt9LFxuICAgICBjb2x1bW46IHt9LFxuICAgICBjbGFzc05hbWU6ICdwZXJjZW50LWNlbGwnLFxuICAgICBmb3JtYXR0ZXI6IEZvcm1hdHRlci5QZXJjZW50Rm9ybWF0dGVyXG4gICB9O1xuIH0sXG5cbiBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCl7XG4gICByZXR1cm4ge1xuICAgICBtdWx0aXBsaWVyOiBGb3JtYXR0ZXIuUGVyY2VudEZvcm1hdHRlci5wcm90b3R5cGUuZGVmYXVsdHMubXVsdGlwbGllcixcbiAgICAgc3ltYm9sOiBGb3JtYXR0ZXIuUGVyY2VudEZvcm1hdHRlci5wcm90b3R5cGUuZGVmYXVsdHMuc3ltYm9sLFxuICAgfVxuIH1cbn0pO1xuXG4vKipcbiAgIERhdGV0aW1lQ2VsbCBpcyBhIGJhc2ljIGNlbGwgdGhhdCBhY2NlcHRzIGRhdGV0aW1lIHN0cmluZyB2YWx1ZXMgaW4gUkZDLTI4MjJcbiAgIG9yIFczQydzIHN1YnNldCBvZiBJU08tODYwMSBhbmQgZGlzcGxheXMgdGhlbSBpbiBJU08tODYwMSBmb3JtYXQuIEZvciBhIG11Y2hcbiAgIG1vcmUgc29waGlzdGljYXRlZCBkYXRlIHRpbWUgY2VsbCB3aXRoIGJldHRlciBkYXRldGltZSBmb3JtYXR0aW5nLCB0YWtlIGFcbiAgIGxvb2sgYXQgdGhlIEJhY2tncmlkLkV4dGVuc2lvbi5Nb21lbnRDZWxsIGV4dGVuc2lvbi5cbiovXG52YXIgRGF0ZXRpbWVDZWxsID0gZXhwb3J0VGhpcy5EYXRldGltZUNlbGwgPSB7fTtcbl8uZXh0ZW5kKERhdGV0aW1lQ2VsbCwgQ2VsbCwge1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIHtcbiAgICAgbW9kZWw6IHt9LFxuICAgICBjb2x1bW46IHt9LFxuICAgICBjbGFzc05hbWU6ICdkYXRldGltZS1jZWxsJyxcbiAgICAgZm9ybWF0dGVyOiBGb3JtYXR0ZXIuRGF0ZXRpbWVGb3JtYXR0ZXJcbiAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuICAgcmV0dXJuIHtcbiAgICAgaW5jbHVkZURhdGU6IEZvcm1hdHRlci5EYXRldGltZUZvcm1hdHRlci5wcm90b3R5cGUuZGVmYXVsdHMuaW5jbHVkZURhdGUsXG4gICAgIGluY2x1ZGVUaW1lOiBGb3JtYXR0ZXIuRGF0ZXRpbWVGb3JtYXR0ZXIucHJvdG90eXBlLmRlZmF1bHRzLmluY2x1ZGVUaW1lLFxuICAgICBpbmNsdWRlTWlsbGk6IEZvcm1hdHRlci5EYXRldGltZUZvcm1hdHRlci5wcm90b3R5cGUuZGVmYXVsdHMuaW5jbHVkZU1pbGxpLFxuICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gTWFrZSBzdXJlIHRoaXMuZm9ybWF0dGVyIGlzIGEgdXNhYmxlIGZ1bmN0aW9uLlxuICAgIHRoaXMuX3VwZGF0ZUZvcm1hdHRlcigpO1xuXG4gICAgdGhpcy5mb3JtYXR0ZXIuaW5jbHVkZURhdGUgPSB0aGlzLnN0YXRlLmluY2x1ZGVEYXRlO1xuICAgIHRoaXMuZm9ybWF0dGVyLmluY2x1ZGVUaW1lID0gdGhpcy5zdGF0ZS5pbmNsdWRlVGltZTtcbiAgICB0aGlzLmZvcm1hdHRlci5pbmNsdWRlTWlsbGkgPSB0aGlzLnN0YXRlLmluY2x1ZGVNaWxsaTtcblxuICAgIHZhciBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgdmFyIGNvbHVtbiA9IHRoaXMucHJvcHMuY29sdW1uO1xuICAgIHZhciByYXdEYXRhID0gXy5yZXN1bHQobW9kZWwsIGNvbHVtbi5uYW1lKTtcblxuICAgIHZhciB2YWx1ZSA9IHRoaXMuZm9ybWF0dGVyLmZyb21SYXcocmF3RGF0YSwgdGhpcy5wcm9wcy5tb2RlbCk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge2NsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWV9LCB2YWx1ZSkpO1xuICB9XG5cbn0pO1xuXG4vKipcbiAgIERhdGVDZWxsIGlzIGEgQmFja2dyaWQuRGF0ZXRpbWVDZWxsIHdpdGhvdXQgdGhlIHRpbWUgcGFydC5cbiovXG52YXIgRGF0ZUNlbGwgPSBleHBvcnRUaGlzLkRhdGVDZWxsID0ge307XG5fLmV4dGVuZChEYXRlQ2VsbCwgRGF0ZXRpbWVDZWxsLCB7XG4gZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgIHJldHVybiB7XG4gICAgIG1vZGVsOiB7fSxcbiAgICAgY29sdW1uOiB7fSxcbiAgICAgY2xhc3NOYW1lOiAnZGF0ZS1jZWxsJyxcbiAgICAgZm9ybWF0dGVyOiBGb3JtYXR0ZXIuRGF0ZXRpbWVGb3JtYXR0ZXJcbiAgIH07XG4gfSxcblxuIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKXtcbiAgIHJldHVybiB7XG4gICAgIGluY2x1ZGVEYXRlOiBGb3JtYXR0ZXIuRGF0ZXRpbWVGb3JtYXR0ZXIucHJvdG90eXBlLmRlZmF1bHRzLmluY2x1ZGVEYXRlLFxuICAgICBpbmNsdWRlVGltZTogZmFsc2UsXG4gICAgIGluY2x1ZGVNaWxsaTogRm9ybWF0dGVyLkRhdGV0aW1lRm9ybWF0dGVyLnByb3RvdHlwZS5kZWZhdWx0cy5pbmNsdWRlTWlsbGksXG4gICB9XG4gfVxufSk7XG5cbi8qKlxuICAgVGltZUNlbGwgaXMgYSBCYWNrZ3JpZC5EYXRldGltZUNlbGwgd2l0aG91dCB0aGUgZGF0ZSBwYXJ0LlxuXG4gICBAY2xhc3MgQmFja2dyaWQuVGltZUNlbGxcbiAgIEBleHRlbmRzIEJhY2tncmlkLkRhdGV0aW1lQ2VsbFxuKi9cbnZhciBUaW1lQ2VsbCA9IGV4cG9ydFRoaXMuVGltZUNlbGwgPSB7fTtcbl8uZXh0ZW5kKFRpbWVDZWxsLCBEYXRldGltZUNlbGwsIHtcbiBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIHtcbiAgICAgbW9kZWw6IHt9LFxuICAgICBjb2x1bW46IHt9LFxuICAgICBjbGFzc05hbWU6ICd0aW1lLWNlbGwnLFxuICAgICBmb3JtYXR0ZXI6IEZvcm1hdHRlci5EYXRldGltZUZvcm1hdHRlclxuICAgfTtcbiB9LFxuXG4gZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuICAgcmV0dXJuIHtcbiAgICAgaW5jbHVkZURhdGU6IGZhbHNlLFxuICAgICBpbmNsdWRlVGltZTogRm9ybWF0dGVyLkRhdGV0aW1lRm9ybWF0dGVyLnByb3RvdHlwZS5kZWZhdWx0cy5pbmNsdWRlVGltZSxcbiAgICAgaW5jbHVkZU1pbGxpOiBGb3JtYXR0ZXIuRGF0ZXRpbWVGb3JtYXR0ZXIucHJvdG90eXBlLmRlZmF1bHRzLmluY2x1ZGVNaWxsaSxcbiAgIH1cbiB9XG59KTtcblxuLyoqXG4gKiBCb29sZWFuQ2VsbCByZW5kZXJzIGEgY2hlY2tib3ggYm90aCBkdXJpbmcgZGlzcGxheSBtb2RlIGFuZCBlZGl0IG1vZGUuXG4gKiBUaGUgY2hlY2tib3ggaXMgY2hlY2tlZCBpZiB0aGUgbW9kZWwgdmFsdWUgaXMgdHJ1ZSwgdW5jaGVja2VkIG90aGVyd2lzZS5cbiovXG52YXIgQm9vbGVhbkNlbGwgPSBleHBvcnRUaGlzLkJvb2xlYW5DZWxsID0ge307XG5fLmV4dGVuZChCb29sZWFuQ2VsbCwgQ2VsbCwge1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIHtcbiAgICAgbW9kZWw6IHt9LFxuICAgICBjb2x1bW46IHt9LFxuICAgICBjbGFzc05hbWU6ICdib29sZWFuLWNlbGwnLFxuICAgICBmb3JtYXR0ZXI6IEZvcm1hdHRlci5DZWxsRm9ybWF0dGVyXG4gICB9O1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gTWFrZSBzdXJlIHRoaXMuZm9ybWF0dGVyIGlzIGEgdXNhYmxlIGZ1bmN0aW9uLlxuICAgIHRoaXMuX3VwZGF0ZUZvcm1hdHRlcigpO1xuXG4gICAgdmFyIG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcbiAgICB2YXIgY29sdW1uID0gdGhpcy5wcm9wcy5jb2x1bW47XG4gICAgdmFyIHJhd0RhdGEgPSBfLnJlc3VsdChtb2RlbCwgY29sdW1uLm5hbWUpO1xuXG4gICAgdmFyIGZvcm1hdHRlZFZhbHVlID0gdGhpcy5mb3JtYXR0ZXIuZnJvbVJhdyhyYXdEYXRhLCB0aGlzLnByb3BzLm1vZGVsKTtcbiAgICB2YXIgdmFsdWUgPSAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwiY2hlY2tib3hcIiwgdGFiSW5kZXg6IFwiLTFcIiwgY2hlY2tlZDogZm9ybWF0dGVkVmFsdWUsIGRpc2FibGVkOiB0cnVlfSlcbiAgICApO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcInRkXCIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lfSwgdmFsdWUpKTtcbiAgfVxufSk7XG5cbi8qKlxuICAgU2VsZWN0Q2VsbCBpcyBhbHNvIGEgZGlmZmVyZW50IGtpbmQgb2YgY2VsbCBpbiB0aGF0IHVwb24gZ29pbmcgaW50byBlZGl0IG1vZGVcbiAgIHRoZSBjZWxsIHJlbmRlcnMgYSBsaXN0IG9mIG9wdGlvbnMgdG8gcGljayBmcm9tLCBhcyBvcHBvc2VkIHRvIGFuIGlucHV0IGJveC5cblxuICAgU2VsZWN0Q2VsbCBjYW5ub3QgYmUgcmVmZXJlbmNlZCBieSBpdHMgc3RyaW5nIG5hbWUgd2hlbiB1c2VkIGluIGEgY29sdW1uXG4gICBkZWZpbml0aW9uIGJlY2F1c2UgaXQgcmVxdWlyZXMgYW4gYG9wdGlvblZhbHVlc2AgY2xhc3MgYXR0cmlidXRlIHRvIGJlXG4gICBkZWZpbmVkLiBgb3B0aW9uVmFsdWVzYCBjYW4gZWl0aGVyIGJlIGEgbGlzdCBvZiBuYW1lLXZhbHVlIHBhaXJzLCB0byBiZVxuICAgcmVuZGVyZWQgYXMgb3B0aW9ucywgb3IgYSBsaXN0IG9mIG9iamVjdCBoYXNoZXMgd2hpY2ggY29uc2lzdCBvZiBhIGtleSAqbmFtZSpcbiAgIHdoaWNoIGlzIHRoZSBvcHRpb24gZ3JvdXAgbmFtZSwgYW5kIGEga2V5ICp2YWx1ZXMqIHdoaWNoIGlzIGEgbGlzdCBvZlxuICAgbmFtZS12YWx1ZSBwYWlycyB0byBiZSByZW5kZXJlZCBhcyBvcHRpb25zIHVuZGVyIHRoYXQgb3B0aW9uIGdyb3VwLlxuXG4gICBJbiBhZGRpdGlvbiwgYG9wdGlvblZhbHVlc2AgY2FuIGFsc28gYmUgYSBwYXJhbWV0ZXItbGVzcyBmdW5jdGlvbiB0aGF0XG4gICByZXR1cm5zIG9uZSBvZiB0aGUgYWJvdmUuIElmIHRoZSBvcHRpb25zIGFyZSBzdGF0aWMsIGl0IGlzIHJlY29tbWVuZGVkIHRoZVxuICAgcmV0dXJuZWQgdmFsdWVzIHRvIGJlIG1lbW9pemVkLiBgXy5tZW1vaXplKClgIGlzIGEgZ29vZCBmdW5jdGlvbiB0byBoZWxwIHdpdGhcbiAgIHRoYXQuXG5cbiAgIER1cmluZyBkaXNwbGF5IG1vZGUsIHRoZSBkZWZhdWx0IGZvcm1hdHRlciB3aWxsIG5vcm1hbGl6ZSB0aGUgcmF3IG1vZGVsIHZhbHVlXG4gICB0byBhbiBhcnJheSBvZiB2YWx1ZXMgd2hldGhlciB0aGUgcmF3IG1vZGVsIHZhbHVlIGlzIGEgc2NhbGFyIG9yIGFuXG4gICBhcnJheS4gRWFjaCB2YWx1ZSBpcyBjb21wYXJlZCB3aXRoIHRoZSBgb3B0aW9uVmFsdWVzYCB2YWx1ZXMgdXNpbmdcbiAgIEVjbWFzY3JpcHQncyBpbXBsaWNpdCB0eXBlIGNvbnZlcnNpb24gcnVsZXMuIFdoZW4gZXhpdGluZyBlZGl0IG1vZGUsIG5vIHR5cGVcbiAgIGNvbnZlcnNpb24gaXMgcGVyZm9ybWVkIHdoZW4gc2F2aW5nIGludG8gdGhlIG1vZGVsLiBUaGlzIGJlaGF2aW9yIGlzIG5vdFxuICAgYWx3YXlzIGRlc2lyYWJsZSB3aGVuIHRoZSB2YWx1ZSB0eXBlIGlzIGFueXRoaW5nIG90aGVyIHRoYW4gc3RyaW5nLiBUb1xuICAgY29udHJvbCB0eXBlIGNvbnZlcnNpb24gb24gdGhlIGNsaWVudC1zaWRlLCB5b3Ugc2hvdWxkIHN1YmNsYXNzIFNlbGVjdENlbGwgdG9cbiAgIHByb3ZpZGUgYSBjdXN0b20gZm9ybWF0dGVyIG9yIHByb3ZpZGUgdGhlIGZvcm1hdHRlciB0byB5b3VyIGNvbHVtblxuICAgZGVmaW5pdGlvbi5cblxuICAgU2VlOlxuICAgICBbJC5mbi52YWwoKV0oaHR0cDovL2FwaS5qcXVlcnkuY29tL3ZhbC8pXG5cbiAgIEBjbGFzcyBCYWNrZ3JpZC5TZWxlY3RDZWxsXG4gICBAZXh0ZW5kcyBCYWNrZ3JpZC5DZWxsXG4qL1xudmFyIFNlbGVjdENlbGwgPSBleHBvcnRUaGlzLlNlbGVjdENlbGwgPSB7fTtcbl8uZXh0ZW5kKFNlbGVjdENlbGwsIENlbGwsIHtcbiBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIHtcbiAgICAgbW9kZWw6IHt9LFxuICAgICBjb2x1bW46IHt9LFxuICAgICBjbGFzc05hbWU6ICdzZWxlY3QtY2VsbCcsXG4gICAgIGZvcm1hdHRlcjogRm9ybWF0dGVyLlNlbGVjdEZvcm1hdHRlclxuICAgfTtcbiB9LFxuXG4gZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xuICAgcmV0dXJuIHtcbiAgICAgbXVsdGlwbGU6IGZhbHNlLFxuICAgICBvcHRpb25WYWx1ZXM6IHVuZGVmaW5lZCxcbiAgICAgZGVsaW1pdGVyOiAnLCAnLFxuICAgfVxuIH0sXG5cbiByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIC8vIE1ha2Ugc3VyZSB0aGlzLmZvcm1hdHRlciBpcyBhIHVzYWJsZSBmdW5jdGlvbi5cbiAgICB0aGlzLl91cGRhdGVGb3JtYXR0ZXIoKTtcblxuICAgIHZhciBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgdmFyIGNvbHVtbiA9IHRoaXMucHJvcHMuY29sdW1uO1xuICAgIHZhciBtb2RlbERhdGEgPSBfLnJlc3VsdChtb2RlbCwgY29sdW1uLm5hbWUpO1xuICAgIHZhciB2YWx1ZSA9ICcnO1xuXG4gICAgdmFyIHJhd0RhdGEgPSB0aGlzLmZvcm1hdHRlci5mcm9tUmF3KG1vZGVsRGF0YSwgdGhpcy5wcm9wcy5tb2RlbCk7XG5cbiAgICB2YXIgb3B0aW9uVmFsdWVzID0gXy5yZXN1bHQodGhpcy5zdGF0ZSwgXCJvcHRpb25WYWx1ZXNcIik7XG5cbiAgICB2YXIgc2VsZWN0ZWRUZXh0ID0gW107XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCFfLmlzQXJyYXkob3B0aW9uVmFsdWVzKSB8fCBfLmlzRW1wdHkob3B0aW9uVmFsdWVzKSkgdGhyb3cgbmV3IFR5cGVFcnJvcjtcblxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCByYXdEYXRhLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciByYXdEYXR1bSA9IHJhd0RhdGFba107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcHRpb25WYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgb3B0aW9uVmFsdWUgPSBvcHRpb25WYWx1ZXNbaV07XG5cbiAgICAgICAgICBpZiAoXy5pc0FycmF5KG9wdGlvblZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIG9wdGlvblRleHQgID0gb3B0aW9uVmFsdWVbMF07XG4gICAgICAgICAgICB2YXIgb3B0aW9uVmFsdWUgPSBvcHRpb25WYWx1ZVsxXTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvblZhbHVlID09IHJhd0RhdHVtKSBzZWxlY3RlZFRleHQucHVzaChvcHRpb25UZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoXy5pc09iamVjdChvcHRpb25WYWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBvcHRpb25Hcm91cFZhbHVlcyA9IG9wdGlvblZhbHVlLnZhbHVlcztcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvcHRpb25Hcm91cFZhbHVlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICB2YXIgb3B0aW9uR3JvdXBWYWx1ZSA9IG9wdGlvbkdyb3VwVmFsdWVzW2pdO1xuICAgICAgICAgICAgICBpZiAob3B0aW9uR3JvdXBWYWx1ZVsxXSA9PSByYXdEYXR1bSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkVGV4dC5wdXNoKG9wdGlvbkdyb3VwVmFsdWVbMF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBzZWxlY3RlZFRleHQuam9pbih0aGlzLmRlbGltaXRlcik7XG4gICAgfVxuICAgIGNhdGNoIChleCkge1xuICAgICAgaWYgKGV4IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCInb3B0aW9uVmFsdWVzJyBtdXN0IGJlIG9mIHR5cGUge0FycmF5LjxBcnJheT58QXJyYXkuPHtuYW1lOiBzdHJpbmcsIHZhbHVlczogQXJyYXkuPEFycmF5Pn0+fVwiKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGV4O1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwge2NsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWV9LCB2YWx1ZSlcbiAgICApO1xuXG4gIH1cbn0pO1xuXG5fLmVhY2goZXhwb3J0VGhpcywgZnVuY3Rpb24oc2luZ2xlQ2VsbCwga2V5KXtcbiAgZXhwb3J0VGhpc1trZXldLmV4dGVuZCA9IGV4dGVuZDtcbiAgZXhwb3J0VGhpc1trZXkgKyAnQ2xhc3MnXSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHNpbmdsZUNlbGwpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0VGhpcztcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG4vLyBUcnkgY2F0Y2ggYmVjYXVzZSBvZiBhbiBpc3N1ZSB3aXRoIGJyb3dzZXJpZnlcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXVsbWlsbHIvZXhvc2tlbGV0b24vaXNzdWVzLzYwXG50cnkgeyBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpOyB9IGNhdGNoKGUpIHsgfTtcbnZhciBIZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzLmpzeCcpO1xudmFyIGV4dGVuZCA9IEhlbHBlcnMuZXh0ZW5kO1xudmFyIGxwYWQgPSBIZWxwZXJzLmxwYWQ7XG5cbnZhciBleHBvcnRUaGlzID0ge307XG5cbi8vIENlbGxcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIENlbGxGb3JtYXR0ZXIgPSBleHBvcnRUaGlzLkNlbGxGb3JtYXR0ZXIgPSBmdW5jdGlvbigpIHt9O1xuXG5fLmV4dGVuZChDZWxsRm9ybWF0dGVyLnByb3RvdHlwZSwge1xuICBmcm9tUmF3OiBmdW5jdGlvbihyYXdEYXRhLCBtb2RlbCl7XG4gICAgcmV0dXJuIHJhd0RhdGE7XG4gIH0sXG5cbiAgdG9SYXc6IGZ1bmN0aW9uKGZvcm1hdHRlZERhdGEsIG1vZGVsKXtcbiAgICByZXR1cm4gOTtcbiAgfVxufSk7XG5cbi8vIE51bWJlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgTnVtYmVyRm9ybWF0dGVyID0gZXhwb3J0VGhpcy5OdW1iZXJGb3JtYXR0ZXIgPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgXy5leHRlbmQodGhpcywgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgaWYgKHRoaXMuZGVjaW1hbHMgPCAwIHx8IHRoaXMuZGVjaW1hbHMgPiAyMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiZGVjaW1hbHMgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDIwXCIpO1xuICB9XG59O1xuXG5OdW1iZXJGb3JtYXR0ZXIucHJvdG90eXBlID0gbmV3IENlbGxGb3JtYXR0ZXIoKTtcblxuXy5leHRlbmQoTnVtYmVyRm9ybWF0dGVyLnByb3RvdHlwZSwge1xuXG4gIGRlZmF1bHRzOiB7XG4gICAgZGVjaW1hbHM6IDIsXG4gICAgZGVjaW1hbFNlcGFyYXRvcjogJy4nLFxuICAgIG9yZGVyU2VwYXJhdG9yOiAnLCdcbiAgfSxcblxuICBIVU1BTklaRURfTlVNX1JFOiAvKFxcZCkoPz0oPzpcXGR7M30pKyQpL2csXG5cbiAgZnJvbVJhdzogZnVuY3Rpb24gKG51bWJlciwgbW9kZWwpIHtcblxuICAgIGlmIChfLmlzTnVsbChudW1iZXIpIHx8IF8uaXNVbmRlZmluZWQobnVtYmVyKSkgcmV0dXJuICcnO1xuXG4gICAgbnVtYmVyID0gbnVtYmVyLnRvRml4ZWQofn50aGlzLmRlY2ltYWxzKTtcblxuICAgIHZhciBwYXJ0cyA9IG51bWJlci5zcGxpdCgnLicpO1xuICAgIHZhciBpbnRlZ2VyUGFydCA9IHBhcnRzWzBdO1xuICAgIHZhciBkZWNpbWFsUGFydCA9IHBhcnRzWzFdID8gKHRoaXMuZGVjaW1hbFNlcGFyYXRvciB8fCAnLicpICsgcGFydHNbMV0gOiAnJztcblxuICAgIHJldHVybiBpbnRlZ2VyUGFydC5yZXBsYWNlKHRoaXMuSFVNQU5JWkVEX05VTV9SRSwgJyQxJyArIHRoaXMub3JkZXJTZXBhcmF0b3IpICsgZGVjaW1hbFBhcnQ7XG4gIH0sXG5cbiAgdG9SYXc6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRhLCBtb2RlbCkge1xuXG4gICAgZm9ybWF0dGVkRGF0YSA9IGZvcm1hdHRlZERhdGEudHJpbSgpO1xuXG4gICAgaWYgKGZvcm1hdHRlZERhdGEgPT09ICcnKSByZXR1cm4gbnVsbDtcblxuICAgIHZhciByYXdEYXRhID0gJyc7XG5cbiAgICB2YXIgdGhvdXNhbmRzID0gZm9ybWF0dGVkRGF0YS5zcGxpdCh0aGlzLm9yZGVyU2VwYXJhdG9yKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRob3VzYW5kcy5sZW5ndGg7IGkrKykge1xuICAgICAgcmF3RGF0YSArPSB0aG91c2FuZHNbaV07XG4gICAgfVxuXG4gICAgdmFyIGRlY2ltYWxQYXJ0cyA9IHJhd0RhdGEuc3BsaXQodGhpcy5kZWNpbWFsU2VwYXJhdG9yKTtcbiAgICByYXdEYXRhID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWNpbWFsUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJhd0RhdGEgPSByYXdEYXRhICsgZGVjaW1hbFBhcnRzW2ldICsgJy4nO1xuICAgIH1cblxuICAgIGlmIChyYXdEYXRhW3Jhd0RhdGEubGVuZ3RoIC0gMV0gPT09ICcuJykge1xuICAgICAgcmF3RGF0YSA9IHJhd0RhdGEuc2xpY2UoMCwgcmF3RGF0YS5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gKHJhd0RhdGEgKiAxKS50b0ZpeGVkKH5+dGhpcy5kZWNpbWFscykgKiAxO1xuICAgIGlmIChfLmlzTnVtYmVyKHJlc3VsdCkgJiYgIV8uaXNOYU4ocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG5cbn0pO1xuXG4vLyBQZXJjZW50XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBQZXJjZW50Rm9ybWF0dGVyID0gZXhwb3J0VGhpcy5QZXJjZW50Rm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge1xuICBOdW1iZXJGb3JtYXR0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cblBlcmNlbnRGb3JtYXR0ZXIucHJvdG90eXBlID0gbmV3IE51bWJlckZvcm1hdHRlcigpLFxuXG5fLmV4dGVuZChQZXJjZW50Rm9ybWF0dGVyLnByb3RvdHlwZSwge1xuXG4gIGRlZmF1bHRzOiBfLmV4dGVuZCh7fSwgTnVtYmVyRm9ybWF0dGVyLnByb3RvdHlwZS5kZWZhdWx0cywge1xuICAgIG11bHRpcGxpZXI6IDEsXG4gICAgc3ltYm9sOiBcIiVcIlxuICB9KSxcblxuICBmcm9tUmF3OiBmdW5jdGlvbiAobnVtYmVyLCBtb2RlbCkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGFyZ3MudW5zaGlmdChudW1iZXIgKiB0aGlzLm11bHRpcGxpZXIpO1xuICAgIHJldHVybiAoTnVtYmVyRm9ybWF0dGVyLnByb3RvdHlwZS5mcm9tUmF3LmFwcGx5KHRoaXMsIGFyZ3MpIHx8IFwiMFwiKSArIHRoaXMuc3ltYm9sO1xuICB9LFxuXG4gIHRvUmF3OiBmdW5jdGlvbiAoZm9ybWF0dGVkVmFsdWUsIG1vZGVsKSB7XG4gICAgdmFyIHRva2VucyA9IGZvcm1hdHRlZFZhbHVlLnNwbGl0KHRoaXMuc3ltYm9sKTtcbiAgICBpZiAodG9rZW5zICYmIHRva2Vuc1swXSAmJiB0b2tlbnNbMV0gPT09IFwiXCIgfHwgdG9rZW5zWzFdID09IG51bGwpIHtcbiAgICAgIHZhciByYXdWYWx1ZSA9IE51bWJlckZvcm1hdHRlci5wcm90b3R5cGUudG9SYXcuY2FsbCh0aGlzLCB0b2tlbnNbMF0pO1xuICAgICAgaWYgKF8uaXNVbmRlZmluZWQocmF3VmFsdWUpKSByZXR1cm4gcmF3VmFsdWU7XG4gICAgICByZXR1cm4gcmF3VmFsdWUgLyB0aGlzLm11bHRpcGxpZXI7XG4gICAgfVxuICB9XG5cbn0pO1xuXG4vLyBEYXRlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBEYXRldGltZUZvcm1hdHRlciA9IGV4cG9ydFRoaXMuRGF0ZXRpbWVGb3JtYXR0ZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBfLmV4dGVuZCh0aGlzLCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICBpZiAoIXRoaXMuaW5jbHVkZURhdGUgJiYgIXRoaXMuaW5jbHVkZVRpbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJFaXRoZXIgaW5jbHVkZURhdGUgb3IgaW5jbHVkZVRpbWUgbXVzdCBiZSB0cnVlXCIpO1xuICB9XG59O1xuRGF0ZXRpbWVGb3JtYXR0ZXIucHJvdG90eXBlID0gbmV3IENlbGxGb3JtYXR0ZXIoKTtcbl8uZXh0ZW5kKERhdGV0aW1lRm9ybWF0dGVyLnByb3RvdHlwZSwge1xuXG4gIGRlZmF1bHRzOiB7XG4gICAgaW5jbHVkZURhdGU6IHRydWUsXG4gICAgaW5jbHVkZVRpbWU6IHRydWUsXG4gICAgaW5jbHVkZU1pbGxpOiBmYWxzZVxuICB9LFxuXG4gIERBVEVfUkU6IC9eKFsrXFwtXT9cXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pJC8sXG4gIFRJTUVfUkU6IC9eKFxcZHsyfSk6KFxcZHsyfSk6KFxcZHsyfSkoXFwuKFxcZHszfSkpPyQvLFxuICBJU09fU1BMSVRURVJfUkU6IC9UfFp8ICsvLFxuXG4gIF9jb252ZXJ0OiBmdW5jdGlvbiAoZGF0YSwgdmFsaWRhdGUpIHtcbiAgICBpZiAoKGRhdGEgKyAnJykudHJpbSgpID09PSAnJykgcmV0dXJuIG51bGw7XG5cbiAgICB2YXIgZGF0ZSwgdGltZSA9IG51bGw7XG4gICAgaWYgKF8uaXNOdW1iZXIoZGF0YSkpIHtcbiAgICAgIHZhciBqc0RhdGUgPSBuZXcgRGF0ZShkYXRhKTtcbiAgICAgIGRhdGUgPSBscGFkKGpzRGF0ZS5nZXRVVENGdWxsWWVhcigpLCA0LCAwKSArICctJyArIGxwYWQoanNEYXRlLmdldFVUQ01vbnRoKCkgKyAxLCAyLCAwKSArICctJyArIGxwYWQoanNEYXRlLmdldFVUQ0RhdGUoKSwgMiwgMCk7XG4gICAgICB0aW1lID0gbHBhZChqc0RhdGUuZ2V0VVRDSG91cnMoKSwgMiwgMCkgKyAnOicgKyBscGFkKGpzRGF0ZS5nZXRVVENNaW51dGVzKCksIDIsIDApICsgJzonICsgbHBhZChqc0RhdGUuZ2V0VVRDU2Vjb25kcygpLCAyLCAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkYXRhID0gZGF0YS50cmltKCk7XG4gICAgICB2YXIgcGFydHMgPSBkYXRhLnNwbGl0KHRoaXMuSVNPX1NQTElUVEVSX1JFKSB8fCBbXTtcbiAgICAgIGRhdGUgPSB0aGlzLkRBVEVfUkUudGVzdChwYXJ0c1swXSkgPyBwYXJ0c1swXSA6ICcnO1xuICAgICAgdGltZSA9IGRhdGUgJiYgcGFydHNbMV0gPyBwYXJ0c1sxXSA6IHRoaXMuVElNRV9SRS50ZXN0KHBhcnRzWzBdKSA/IHBhcnRzWzBdIDogJyc7XG4gICAgfVxuXG4gICAgdmFyIFlZWVlNTUREID0gdGhpcy5EQVRFX1JFLmV4ZWMoZGF0ZSkgfHwgW107XG4gICAgdmFyIEhIbW1zc1NTUyA9IHRoaXMuVElNRV9SRS5leGVjKHRpbWUpIHx8IFtdO1xuXG4gICAgaWYgKHZhbGlkYXRlKSB7XG4gICAgICBpZiAodGhpcy5pbmNsdWRlRGF0ZSAmJiBfLmlzVW5kZWZpbmVkKFlZWVlNTUREWzBdKSkgcmV0dXJuO1xuICAgICAgaWYgKHRoaXMuaW5jbHVkZVRpbWUgJiYgXy5pc1VuZGVmaW5lZChISG1tc3NTU1NbMF0pKSByZXR1cm47XG4gICAgICBpZiAoIXRoaXMuaW5jbHVkZURhdGUgJiYgZGF0ZSkgcmV0dXJuO1xuICAgICAgaWYgKCF0aGlzLmluY2x1ZGVUaW1lICYmIHRpbWUpIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIganNEYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoWVlZWU1NRERbMV0gKiAxIHx8IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFlZWVlNTUREWzJdICogMSAtIDEgfHwgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWVlZWU1NRERbM10gKiAxIHx8IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhIbW1zc1NTU1sxXSAqIDEgfHwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSEhtbXNzU1NTWzJdICogMSB8fCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBISG1tc3NTU1NbM10gKiAxIHx8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhIbW1zc1NTU1s1XSAqIDEgfHwgbnVsbCkpO1xuXG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuXG4gICAgaWYgKHRoaXMuaW5jbHVkZURhdGUpIHtcbiAgICAgIHJlc3VsdCA9IGxwYWQoanNEYXRlLmdldFVUQ0Z1bGxZZWFyKCksIDQsIDApICsgJy0nICsgbHBhZChqc0RhdGUuZ2V0VVRDTW9udGgoKSArIDEsIDIsIDApICsgJy0nICsgbHBhZChqc0RhdGUuZ2V0VVRDRGF0ZSgpLCAyLCAwKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbmNsdWRlVGltZSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKHRoaXMuaW5jbHVkZURhdGUgPyAnVCcgOiAnJykgKyBscGFkKGpzRGF0ZS5nZXRVVENIb3VycygpLCAyLCAwKSArICc6JyArIGxwYWQoanNEYXRlLmdldFVUQ01pbnV0ZXMoKSwgMiwgMCkgKyAnOicgKyBscGFkKGpzRGF0ZS5nZXRVVENTZWNvbmRzKCksIDIsIDApO1xuXG4gICAgICBpZiAodGhpcy5pbmNsdWRlTWlsbGkpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgJy4nICsgbHBhZChqc0RhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCksIDMsIDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmluY2x1ZGVEYXRlICYmIHRoaXMuaW5jbHVkZVRpbWUpIHtcbiAgICAgIHJlc3VsdCArPSBcIlpcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIGZyb21SYXc6IGZ1bmN0aW9uIChyYXdEYXRhLCBtb2RlbCkge1xuICAgIGlmIChfLmlzTnVsbChyYXdEYXRhKSB8fCBfLmlzVW5kZWZpbmVkKHJhd0RhdGEpKSByZXR1cm4gJyc7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnZlcnQocmF3RGF0YSk7XG4gIH0sXG5cbiAgdG9SYXc6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRhLCBtb2RlbCkge1xuICAgIHJldHVybiB0aGlzLl9jb252ZXJ0KGZvcm1hdHRlZERhdGEsIHRydWUpO1xuICB9XG5cbn0pO1xuXG4vLyBTdHJpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIFN0cmluZ0Zvcm1hdHRlciA9IGV4cG9ydFRoaXMuU3RyaW5nRm9ybWF0dGVyID0gZnVuY3Rpb24gKCkge307XG5TdHJpbmdGb3JtYXR0ZXIucHJvdG90eXBlID0gbmV3IENlbGxGb3JtYXR0ZXIoKTtcblxuXy5leHRlbmQoU3RyaW5nRm9ybWF0dGVyLnByb3RvdHlwZSwge1xuICBmcm9tUmF3OiBmdW5jdGlvbiAocmF3VmFsdWUsIG1vZGVsKSB7XG4gICAgaWYgKF8uaXNVbmRlZmluZWQocmF3VmFsdWUpIHx8IF8uaXNOdWxsKHJhd1ZhbHVlKSkgcmV0dXJuICcnO1xuICAgIHJldHVybiByYXdWYWx1ZSArICcnO1xuICB9XG59KTtcblxuLy8gRW1haWxcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIEVtYWlsRm9ybWF0dGVyID0gZXhwb3J0VGhpcy5FbWFpbEZvcm1hdHRlciA9IGZ1bmN0aW9uICgpIHt9O1xuRW1haWxGb3JtYXR0ZXIucHJvdG90eXBlID0gbmV3IENlbGxGb3JtYXR0ZXIoKTtcblxuXy5leHRlbmQoRW1haWxGb3JtYXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgdG9SYXc6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRhLCBtb2RlbCkge1xuICAgIHZhciBwYXJ0cyA9IGZvcm1hdHRlZERhdGEudHJpbSgpLnNwbGl0KFwiQFwiKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyICYmIF8uYWxsKHBhcnRzKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdHRlZERhdGE7XG4gICAgfVxuICB9XG59KTtcblxuLy8gU2VsZWN0XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBTZWxlY3RGb3JtYXR0ZXIgPSBleHBvcnRUaGlzLlNlbGVjdEZvcm1hdHRlciA9IGZ1bmN0aW9uICgpIHt9O1xuU2VsZWN0Rm9ybWF0dGVyLnByb3RvdHlwZSA9IG5ldyBDZWxsRm9ybWF0dGVyKCk7XG5cbl8uZXh0ZW5kKFNlbGVjdEZvcm1hdHRlci5wcm90b3R5cGUsIHtcblxuICBmcm9tUmF3OiBmdW5jdGlvbiAocmF3VmFsdWUsIG1vZGVsKSB7XG4gICAgcmV0dXJuIF8uaXNBcnJheShyYXdWYWx1ZSkgPyByYXdWYWx1ZSA6IHJhd1ZhbHVlICE9IG51bGwgPyBbcmF3VmFsdWVdIDogW107XG4gIH1cbn0pO1xuXG5fLmVhY2goZXhwb3J0VGhpcywgZnVuY3Rpb24oZm9ybWF0dGVyLCBrZXkpe1xuICBleHBvcnRUaGlzW2tleV0uZXh0ZW5kID0gZXh0ZW5kO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0VGhpcztcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG4vLyBUcnkgY2F0Y2ggYmVjYXVzZSBvZiBhbiBpc3N1ZSB3aXRoIGJyb3dzZXJpZnlcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXVsbWlsbHIvZXhvc2tlbGV0b24vaXNzdWVzLzYwXG50cnkgeyBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpOyB9IGNhdGNoKGUpIHsgfTtcblxuZXhwb3J0cy5scGFkID0gZnVuY3Rpb24gbHBhZChzdHIsIGxlbmd0aCwgcGFkc3RyKSB7XG4gIHZhciBwYWRkaW5nTGVuID0gbGVuZ3RoIC0gKHN0ciArICcnKS5sZW5ndGg7XG4gIHBhZGRpbmdMZW4gPSAgcGFkZGluZ0xlbiA8IDAgPyAwIDogcGFkZGluZ0xlbjtcbiAgdmFyIHBhZGRpbmcgPSAnJztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWRkaW5nTGVuOyBpKyspIHtcbiAgICBwYWRkaW5nID0gcGFkZGluZyArIHBhZHN0cjtcbiAgfVxuICByZXR1cm4gcGFkZGluZyArIHN0cjtcbn1cblxuZXhwb3J0cy5leHRlbmQgPSBmdW5jdGlvbihzdGF0aWNQcm9wcywgcHJvdG9Qcm9wcykge1xuICB2YXIgcGFyZW50ID0gdGhpcztcbiAgdmFyIGNoaWxkID0ge307XG5cbiAgLy8gQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiwgaWYgc3VwcGxpZWQuXG4gIF8uZXh0ZW5kKGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzKTtcblxuICAvLyBBZGQgcHJvdG90eXBlIHByb3BlcnRpZXMgKGluc3RhbmNlIHByb3BlcnRpZXMpIHRvIHRoZSBzdWJjbGFzcyxcbiAgLy8gaWYgc3VwcGxpZWQuXG4gIGlmIChwcm90b1Byb3BzKSBfLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuXG4gIHJldHVybiBjaGlsZDtcbn07XG5cbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlJvd1wiLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyXCIsIG51bGwsIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb3c7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFRoZWFkID0gcmVxdWlyZSgnLi90aGVhZC5qc3gnKTtcbnZhciBUYm9keSA9IHJlcXVpcmUoJy4vdGJvZHkuanN4Jyk7XG5cbnZhciBUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUYWJsZVwiLFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbnM6IFtdXG4gICAgfTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHRhYmxlID0gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIHtjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGhlYWQsIHtjb2x1bW5zOiB0aGlzLnByb3BzLmNvbHVtbnN9KSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGJvZHksIHtjb2xsZWN0aW9uOiB0aGlzLnByb3BzLmNvbGxlY3Rpb24sIGNvbHVtbnM6IHRoaXMucHJvcHMuY29sdW1uc30pXG4gICAgICApXG4gICAgKTtcblxuICAgIGlmKHRoaXMucHJvcHMucmVzcG9uc2l2ZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRhYmxlLXJlc3BvbnNpdmVcIn0sIFxuICAgICAgICAgIHRhYmxlXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0YWJsZTtcbiAgICB9XG5cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGU7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxuLy8gVHJ5IGNhdGNoIGJlY2F1c2Ugb2YgYW4gaXNzdWUgd2l0aCBicm93c2VyaWZ5XG4vLyBodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2V4b3NrZWxldG9uL2lzc3Vlcy82MFxudHJ5IHsgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTsgfSBjYXRjaChlKSB7IH07XG52YXIgQ2VsbHMgPSByZXF1aXJlKCcuL2NlbGwuanN4Jyk7XG52YXIgVHIgPSByZXF1aXJlKCcuL3Jvdy5qc3gnKTtcblxudmFyIFRib2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRib2R5XCIsXG4gIHJlbmRlciA6IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgYWxsQ29sdW1ucyA9IHRoaXMucHJvcHMuY29sdW1ucztcbiAgICB2YXIgY29sbGVjdGlvbiA9IHRoaXMucHJvcHMuY29sbGVjdGlvbjtcblxuICAgIHZhciByb3dzID0gW107XG5cbiAgICBpZiAoXy5pc0VtcHR5KGNvbGxlY3Rpb24pKSByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiLCBudWxsKSk7XG5cbiAgICBfLmVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24obW9kZWwsIGtleUNvbGxlY3Rpb24pe1xuICAgICAgdmFyIGl0ZW1zID0gW107XG5cbiAgICAgIF8uZWFjaChhbGxDb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4sIGtleUNvbHVtbil7XG4gICAgICAgIHZhciBDb21wb25lbnRDbGFzcyA9IENlbGxzLkNlbGxDbGFzcztcblxuICAgICAgICBpZiAoY29sdW1uLmNlbGwgJiYgdHlwZW9mIGNvbHVtbi5jZWxsID09PSAnc3RyaW5nJyl7XG4gICAgICAgICAgdmFyIHRoZUNsYXNzTmFtZSA9IGNvbHVtbi5jZWxsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY29sdW1uLmNlbGwuc2xpY2UoMSkgKyAnQ2VsbENsYXNzJztcbiAgICAgICAgICBDb21wb25lbnRDbGFzcyA9IENlbGxzW3RoZUNsYXNzTmFtZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBDb21wb25lbnRDbGFzcyAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ1tyZWFjdGdyaWRdIFVua25vd24gQ2xhc3MgbmFtZTogXCInK2NvbHVtbi5jZWxsKydcIicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjb2x1bW4uY2VsbCAmJiB0eXBlb2YgY29sdW1uLmNlbGwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBDb21wb25lbnRDbGFzcyA9IGNvbHVtbi5jZWxsO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb25lbnRDbGFzcywge21vZGVsOiBtb2RlbCwgY29sdW1uOiBjb2x1bW4sIGtleToga2V5Q29sdW1ufSkgKTtcbiAgICAgIH0pO1xuXG4gICAgICByb3dzLnB1c2goUmVhY3QuY3JlYXRlRWxlbWVudChUciwge2tleToga2V5Q29sbGVjdGlvbn0sIGl0ZW1zKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRib2R5XCIsIG51bGwsIFxuICAgICAgICByb3dzXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGJvZHk7XG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxuLy8gVHJ5IGNhdGNoIGJlY2F1c2Ugb2YgYW4gaXNzdWUgd2l0aCBicm93c2VyaWZ5XG4vLyBodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2V4b3NrZWxldG9uL2lzc3Vlcy82MFxudHJ5IHsgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTsgfSBjYXRjaChlKSB7IH07XG52YXIgVGggPSByZXF1aXJlKCcuL2NlbGwuanN4JykuSGVhZGVyQ2VsbENsYXNzO1xuXG52YXIgVGhlYWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGhlYWRcIixcblxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGNvbHVtbnMgPSBbXTtcblxuICAgIF8uZWFjaCh0aGlzLnByb3BzLmNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbiwga2V5KXtcbiAgICAgIGNvbHVtbnMucHVzaChSZWFjdC5jcmVhdGVFbGVtZW50KFRoLCB7a2V5OiBrZXl9LCBjb2x1bW4ubGFiZWwpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGhlYWRcIiwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0clwiLCBudWxsLCBcbiAgICAgICAgICBjb2x1bW5zXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaGVhZDtcbiJdfQ==
