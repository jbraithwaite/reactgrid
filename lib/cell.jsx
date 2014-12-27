/** @jsx React.DOM */

var Formatter = require('./formatter.jsx');
var _ = require('underscore');
var exportThis = {};

// Cell mixin
var CellMixin = exportThis.CellMixin = {

  getDefaultProps: function() {
    return {
      model: {},
      field: ''
    };
  },

  formatter: Formatter.CellFormatter,

  formatterValue: function(){
    var model = this.props.model;
    var column = this.props.column;

    var rawData = model && model[column.name];

    if (rawData){

      var CellFormatter;
      var formatter;

      // First check to see if the column has a formatter function
      if (column.formatter && typeof column.formatter === 'function'){
        CellFormatter = column.formatter;
        formatter = new CellFormatter();
      }
      // Next check to see if the formatter is a string
      else if (column.formatter && typeof column.formatter === 'string'){
        CellFormatter = Formatter[column.formatter]
        formatter = new CellFormatter();
      }
      // Next use the default formatter
      else if (typeof this.formatter === 'string'){
        CellFormatter = Formatter[this.formatter];
        formatter = new CellFormatter();
      } else {
        console.log('hey', typeof this.formatter);
        formatter = this.formatter
      }

      value = formatter.fromRaw(rawData);
    }

    if (column.cell && typeof column.cell === 'function'){
      value = column.cell(model, column);
    }

    return value;
  }

};

var HeaderCell = exportThis.HeaderCell = React.createClass({
  render: function() {
    return (<th>{this.props.children}</th>);
  }
});


var Cell = exportThis.Cell = React.createClass(_.extend(CellMixin,{
  formatter: 'CellFormatter',
  render: function() {
    var value = this.formatterValue();
    return (<td className="cell">{value}</td>);
  }
}));

var NumberCell = exportThis.NumberCell = React.createClass(_.extend(CellMixin,{
  formatter: Formatter.NumberFormatter,
  render: function() {
    var value = this.formatterValue();
    return (<td className="number-cell">{value}</td>);
  }
}));

var StringCell = exportThis.StringCell = React.createClass(_.extend(CellMixin,{
  formatter: 'StringFormatter',
  render: function() {
    var value = this.formatterValue();
    return (<td className="string-cell">{value}</td>);
  }
}));

var EmailCell = exportThis.EmailCell = React.createClass(_.extend(CellMixin,{
  formatter: 'EmailFormatter',
  render: function() {
    var value = this.formatterValue();
    return (<td className="email-cell">{value}</td>);
  }
}));

var SelectCell = exportThis.SelectCell = React.createClass(_.extend(CellMixin,{
  formatter: 'SelectFormatter',
  render: function() {
    var value = this.formatterValue();
    return (<td className="select-cell">{value}</td>);
  }
}));

var DatetimeCell = exportThis.DatetimeCell = React.createClass(_.extend(CellMixin,{
  formatter: 'DatetimeFormatter',
  render: function() {
    var value = this.formatterValue();
    return (<td className="datetime-cell">{value}</td>);
  }
}));



module.exports = exportThis;
