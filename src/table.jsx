/** @jsx React.DOM */

var Thead = require('./thead.jsx');
var Tbody = require('./tbody.jsx');

var Table = React.createClass({

  getDefaultProps: function() {
    return {
      columns: []
    };
  },

  render: function() {

    var table = (
      <table className={this.props.className}>
        <Thead columns={this.props.columns}/>
        <Tbody collection={this.props.collection} columns={this.props.columns}/>
      </table>
    );

    if(this.props.responsive) {
      return (
        <div className='table-responsive'>
          {table}
        </div>
      );
    } else {
      return table;
    }

  }
});

module.exports = Table;
