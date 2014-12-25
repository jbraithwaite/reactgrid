/** @jsx React.DOM */

var Thead = React.createClass({

  render: function(){
    var columns = [];
    var allColumns = this.props.columns;

    for (var key in allColumns) {
      columns.push(<td key={key}>{allColumns[key].label}</td>);
    }

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
