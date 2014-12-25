/** @jsx React.DOM */

var _ = require('underscore');

var Cell = require('./cell.jsx');
var Row = require('./row.jsx');

var Tbody = React.createClass({
  render : function(){

    var allColumns = this.props.columns;
    var collection = this.props.collection;

    var rows = [];

    if (_.isEmpty(collection)) return (<tbody></tbody>);

    _.each(collection, function(model, keyCollection){
      var items = [];

      _.each(allColumns, function(column, keyColumn){
        items.push(<Cell model={model} column={column} key={keyColumn}/> );
      });

      rows.push(<Row key={keyCollection}>{items}</Row>);
    });

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
});

module.exports = Tbody;
