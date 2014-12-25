/** @jsx React.DOM */

var classSet = React.addons.classSet;

var Thead = require('./thead.jsx');
var Tbody = require('./tbody.jsx');

var Table = React.createClass({

  getDefaultProps: function() {
    return {
      columns: []
    };
  },


  propTypes: {
    hover: React.PropTypes.bool,
    striped: React.PropTypes.bool,
    bordered: React.PropTypes.bool,
    collapsed: React.PropTypes.bool,
    condensed: React.PropTypes.bool,
    responsive: React.PropTypes.bool,

    alignTop: React.PropTypes.bool,
    alignMiddle: React.PropTypes.bool,
    alignBottom: React.PropTypes.bool
  },

  render: function() {
    var classes = classSet({
      'table': true,
      'table-hover': this.props.hover,
      'table-striped': this.props.striped,
      'table-bordered': this.props.bordered,
      'table-collapsed': this.props.collapsed,
      'table-condensed': this.props.condensed,
      'table-top-align': this.props.alignTop,
      'table-middle-align': this.props.alignMiddle,
      'table-bottom-align': this.props.alignBottom
    });

    var table = (
      <table className={classes}>
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
