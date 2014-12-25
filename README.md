# reactgrid

Create tables with React. Inspirited by [backgrid.js](http://backgridjs.com/)

## WIP

**DO NOT USE IN PRODUCTION UNTIL v1.0.0**

## Example Usage

```js
var Table = require('reactgrid');

var columns = [
  {
    label: 'ID',
    name: 'id'
  },
  {
    label: 'Name',
    name: 'name'
  },
  {
    label: 'Created',
    name: 'created'
  },
  {
    label: 'Actions',
    cell: function(model, column){
    return (
        <ButtonGroup>
          <Button>Delete</Button>
          <Button>Edit</Button>
          <Button>View</Button>
        </ButtonGroup>
       );
    }
  }
];

var actors = {[
    {id: 1, name: "James", created: "12-12-12"},
    {id: 2, name: "Jill", created: "12-13-12"},
    {id: 3, name: "Joe", created: "12-14-12"}
]};

<Table columns={columns} collection={actors}/>
```

## Todos

- [X] Display content from a 'collection'
- [ ] Cell types
- [ ] Events
- [ ] Plugins (moment-cell, paginator)
- [ ] Feature parity with backgrid 
