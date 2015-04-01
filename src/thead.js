var _ = require('underscore');
var React = require('react');
var Th = require('./cell.js').HeaderCellClass;

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
