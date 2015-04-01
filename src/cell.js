var _ = require('underscore');
var React = require('react');
var Formatter = require('./formatter.js');
var Helpers = require('./helpers.js');
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

  // Make sure each class has a displayName
  // This was causing issues with Webpack
  exportThis[key + 'Class'] = React.createClass(_.extend({},singleCell,{displayName: key + 'Class' }));
});

module.exports = exportThis;
