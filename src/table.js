var React = require('React');
var Thead = require('./thead.js');
var Tbody = require('./tbody.js');

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
