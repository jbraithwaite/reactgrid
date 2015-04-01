var React = require('react');
var Thead = require('./thead');
var Tbody = require('./tbody');

var Table = React.createClass({displayName: "Table",
  getDefaultProps: function() {
    return {
      columns: []
    };
  },

  render: function() {
    var table = (
      React.createElement("table", {className: this.props.className},
        React.createElement(Thead, {columns: this.props.columns}),
        React.createElement(Tbody, {collection: this.props.collection, columns: this.props.columns})
      )
    );

    if(this.props.responsive) {
      return (
        React.createElement("div", {className: "table-responsive"},
          table
        )
      );
    } else {
      return table;
    }
  }
});

module.exports = Table;
