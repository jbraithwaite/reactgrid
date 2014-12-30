/** @jsx React.DOM */

// Try catch because of an issue with browserify
// https://github.com/paulmillr/exoskeleton/issues/60
try { _ = require('underscore'); } catch(e) { };
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
        items.push(<ComponentClass model={model} column={column} key={keyColumn}/> );
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
