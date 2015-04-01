


# reactgrid

Create tables with React. Completely inspired by [backgrid.js](http://backgridjs.com/)

## Dependencies
- React 
- Underscore 

## WIP

**DO NOT USE IN PRODUCTION UNTIL v1.0.0**

## Example Usage

Server side:

```js

var React = require('react');
var Reactgrid = require('reactgrid');

var columns = [
  {
    label: 'ID',
    name: 'id',
    cell: 'integer'
  },
  {
    label: 'Name',
    name: 'name',
    cell: 'string'
  },
  {
    label: 'Created',
    name: 'created',
    cell: 'datetime'
  },
  {
    label: 'Actions',
    cell: React.createClass(Reactgrid.Cell.Cell.extend({
      getInitialState: function(){
        return {
          seconds: 0
        }
      },
      componentDidMount : function(){
        setInterval(function(){
          if (this.isMounted()){
            this.setState({
               seconds: this.state.seconds + 1
            });
          }
        }.bind(this), 1000);
      },
     render : function(){
       return (<td className={this.props.className}>{this.state.seconds} Seconds. Model ID: {this.props.model.id}</td>);
     },
   }))
  }
];

var actors = [
    {id: 1, name: "James", created: "2014-12-29 09:30:30"},
    {id: 2, name: "Jill", created: "2014-12-29 09:30:30"},
    {id: 3, name: "Joe", created: "2014-12-29 09:30:30"}
];

<Reactgrid.Table columns={columns} collection={actors}/>
```

For a client side example, please see the demo

## For Developers

```
  npm install
  gulp 
```

## Todos

- [X] Cell types
- [ ] Plugins / Extensions (moment-cell, paginator)
- [ ] Make cells editable 
- [ ] Tests in [Jest](http://facebook.github.io/jest/)
- [ ] Complete feature parity with backgrid 
