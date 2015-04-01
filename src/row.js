var React = require('react');

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
