import React from "react";
import { Grid } from "react-virtualized";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';

const useStyles = makeStyles((theme) => ({
  search: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '97%',
    },
  },
  cell: {
    border: '1px solid black'
  }
}));

const width = 20;
const height = 1000;

function generateData() {
  const rows = [] as any;

  for (let i = 0; i < height; i++) {
    rows[i] = [];

    for (let j = 0; j < width; j++) {
      rows[i].push(`r: ${i}, c: ${j}`);
    }
  }

  return rows;
}

function Table() {
  const classes = useStyles();
  const [search, setSearch] = React.useState('');

  const filteredData = generateData().filter(row => row.some(cell => cell.toLowerCase().includes(search.toLowerCase())))

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const cellRenderer = (obj) => {
    if (filteredData[obj.rowIndex]) {
      return (
        <div className={classes.cell} key={obj.key} style={obj.style} onDoubleClick={() => console.log(obj)}>
          <div>{filteredData[obj.rowIndex][obj.columnIndex]}</div>
        </div>
      );
    }
  };

  return (
    <div>
      <form className={classes.search} noValidate autoComplete="off">
        <TextField
          id="outlined-name"
          label="Search"
          value={search}
          onChange={handleSearch}
          variant="outlined"
        />
      </form>
        <Grid
        cellRenderer={cellRenderer}
        columnCount={width}
        columnWidth={100}
        height={500}
        rowCount={filteredData.length}
        rowHeight={30}
        width={500}
      />
    </div>
  );
}

export default Table;
