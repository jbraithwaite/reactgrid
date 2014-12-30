/** @jsx React.DOM */

// Try catch because of an issue with browserify
// https://github.com/paulmillr/exoskeleton/issues/60
try { _ = require('underscore'); } catch(e) { };
var Th = require('./cell.jsx').HeaderCellClass;

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
