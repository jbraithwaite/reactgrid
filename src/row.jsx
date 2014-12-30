/** @jsx React.DOM */

var Row = React.createClass({

  render: function() {

    return (
      <tr>
        {this.props.children}
      </tr>
    );
  }

});

module.exports = Row;
