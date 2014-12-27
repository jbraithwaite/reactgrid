/** @jsx React.DOM */

var _ = require('underscore');

var Cells = require('./cell.jsx');

var Tr = require('./row.jsx');

var Tbody = React.createClass({
  render : function(){

    var allColumns = this.props.columns;
    var collection = this.props.collection;

    var rows = [];

    if (_.isEmpty(collection)) return (<tbody></tbody>);

    _.each(collection, function(model, keyCollection){
      var items = [];

      _.each(allColumns, function(column, keyColumn){

        var componentClass = Cells.Cell;

        if (column.cell && typeof column.cell === 'string'){
          componentClass = Cells[column.cell.charAt(0).toUpperCase() + column.cell.slice(1) + 'Cell'];
        }

        items.push(<componentClass model={model} column={column} key={keyColumn}/> );
      });

      rows.push(<Tr key={keyCollection}>{items}</Tr>);
    });

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
});

module.exports = Tbody;
