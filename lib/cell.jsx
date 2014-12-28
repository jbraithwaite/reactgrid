/** @jsx React.DOM */

var _          = require('underscore');
var Formatter  = require('./formatter.jsx');
var Helpers    = require('./helpers.jsx');
var extend     = Helpers.extend;
var exportThis = {};

var HeaderCell = exportThis.HeaderCell = {
  render: function() {
    return (<th>{this.props.children}</th>);
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
    var rawData = model && model[column.name];

    var value = this.formatter.fromRaw(rawData, this.props.model);
    return (<td className={this.props.className}>{value}</td>);
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
    var rawData = model && model[column.name];

    var value = this.formatter.fromRaw(rawData, this.props.model);
    return (<td className={this.props.className}>{value}</td>);
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
    var rawData = model && model[column.name];

    var formattedValue = this.formatter.fromRaw(rawData, this.props.model);
    var title = this.state.title || formattedValue;

    var value = (
      <a
        href={formattedValue}
        title={title}
        target={this.state.target}
        tabIndex="-1">
        {formattedValue}
      </a>
    );

    return (<td className={this.props.className}>{value}</td>);
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
    var rawData = model && model[column.name];

    var formattedValue = this.formatter.fromRaw(rawData, this.props.model);

    var value = (
      <a
        href={'mailto:'+formattedValue}
        title={formattedValue}
        tabIndex="-1">
        {formattedValue}
      </a>
    );

    return (<td className={this.props.className}>{value}</td>);
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
    var rawData = model && model[column.name];

    var value = this.formatter.fromRaw(rawData, this.props.model);
    return (<td className={this.props.className}>{value}</td>);
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
    var rawData = model && model[column.name];

    var formattedValue = this.formatter.fromRaw(rawData, this.props.model);
    var value = (
      <input type="checkbox" tabIndex="-1" checked={formattedValue} disabled={true}/>
    );
    return (<td className={this.props.className}>{value}</td>);
  }
});

_.each(exportThis, function(singleCell, key){
  exportThis[key].extend = extend;
  exportThis[key + 'Class'] = React.createClass(singleCell);
});

module.exports = exportThis;
