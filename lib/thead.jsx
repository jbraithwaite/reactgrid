/** @jsx React.DOM */

var Th = require('./cell.jsx').HeaderCell;
var _ = require('underscore');

var Thead = React.createClass({

  render: function(){
    var columns = [];

    _.each(this.props.columns, function(column, key){
      columns.push(<Th key={key}>{column.label}</Th>);
    });

    return (
      <thead>
        <tr>
          {columns}
        </tr>
      </thead>
    );
  }
});

module.exports = Thead;
