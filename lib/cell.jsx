/** @jsx React.DOM */

var Cell = React.createClass({

  getDefaultProps: function() {
    return {
      model: {},
      field: ''
    };
  },

  render: function() {

    var model = this.props.model;
    var column = this.props.column;
    var value = model && model[column.name];

    if (column.cell) {
      value = column.cell(model, column);
    }

    return (<td>{value}</td>);
  }
});

module.exports = Cell;
