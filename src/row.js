var React = require('React');

var Row = React.createClass({displayName: "Row",

  render: function() {

    return (
      React.createElement("tr", null,
        this.props.children
      )
    );
  }

});

module.exports = Row;
