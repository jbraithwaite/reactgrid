var _ = require('underscore');
var Tr = require('./row');
var Cells = require('./cells');
var React = require('react');

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
