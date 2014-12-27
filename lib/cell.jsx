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
      field: '',
      tagName: (<td/>),
      formatter: Formatter.CellFormatter,
      className: 'cell',
    };
  },

  formatterValue: function(){
    var model = this.props.model;
    var column = this.props.column;

    if (!column || !model) return null;
    var rawData = model && model[column.name];

    if (rawData){

      var CellFormatter;
      var formatter;

      // First check to see if the column has a formatter function
      if (column.formatter && typeof column.formatter === 'function'){
        CellFormatter = column.formatter;
      }
      // Next check to see if the formatter is a string
      else if (column.formatter && typeof column.formatter === 'string'){
        CellFormatter = Formatter[column.formatter]
      }
      // Next use the default formatter
      else if (typeof this.props.formatter === 'string'){
        CellFormatter = Formatter[this.props.formatter];
      } else {
        CellFormatter = this.props.formatter
      }

      formatter = new CellFormatter(this.props.formatterOptions);
      value = formatter.fromRaw(rawData);
    }

    if (column.renderCell && typeof column.renderCell === 'function'){
      value = column.renderCell(model, column);
    }

    return value;
  },

  render: function() {
    var value = this.formatterValue();
    return (<td className={this.props.className}>{value}</td>);
  }
};

var NumberCell = exportThis.NumberCell = {};

_.extend(NumberCell, Cell, {
  getDefaultProps: function() {
    return {
      model: {},
      field: '',
      tagName: (<td/>),
      formatter: Formatter.NumberFormatter,
      className: 'number-cell',
    };
  }
});

_.each(exportThis, function(singleCell, key){
  exportThis[key].extend = extend;
  exportThis[key + 'Class'] = React.createClass(singleCell);
});

module.exports = exportThis;
