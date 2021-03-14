import './App.css';

import React from "react";
import { Grid } from "react-virtualized";
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Paper, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  search: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '97%',
    },
  },
  cell: {
    border: '1px solid black'
  },
  paper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
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
  const [data, setData] = React.useState(generateData());
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [currentCell, setCurrentCell] = React.useState({} as CurrentCell);

  function getData() {
    return generateData().filter(row => row.some(cell => cell.toLowerCase().includes(search.toLowerCase())))
  }

  const handleSearch = (event) => {
    setData(getData())
    setSearch(event.target.value)
  }

  const handleOpen = (obj, d) => {
    setCurrentCell(() => ({
      key: obj.key,
      value: d.target.outerText,
      columnIndex: obj.columnIndex,
      rowIndex: obj.rowIndex
    }))
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    (data[currentCell.columnIndex][currentCell.rowIndex] as any) = currentCell.value;
  };

  const handleChangeCell = (e) => {
    setCurrentCell(state => ({
      ...state,
      value: e.target.value
    }))
  }

  const cellRenderer = (obj) => {
    if (data[obj.rowIndex]) {
      return (
        <div className={classes.cell} key={obj.key} style={obj.style} onDoubleClick={(d) => handleOpen(obj, d)}>
          <div>{data[obj.rowIndex][obj.columnIndex]}</div>
        </div>
      );
    }
  };

  const modalBody = (
    <div className={classes.paper}>
      <TextField
        id="outlined-name"
        label="test"
        value={currentCell.value}
        onChange={(e) => handleChangeCell(e)}
        variant="outlined"
      />
    </div>
  );

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
      
      <Paper style={{ height: 500, width: '100%' }}>
        <Grid
          cellRenderer={cellRenderer}
          columnCount={width}
          columnWidth={100}
          height={500}
          rowCount={data.length}
          rowHeight={30}
          width={window.innerWidth}
        />
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {modalBody}
      </Modal>
    </div>
  );
}

interface CurrentCell {
  key: string | null;
  value: string | null;
  columnIndex: number;
  rowIndex: number;
}

export default Table;
