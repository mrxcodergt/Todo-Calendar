import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns as DateFnsAdapter } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "top-center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 500,
    maxHeight: 300,
    outline: 0,
    marginTop: 10,
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  input: {
    flex: 1,
    margin: theme.spacing(0, 1),
    "& input": {
      borderColor: "#47c7a7",
    },
    "& label": {
      color: "#47c7a7",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#47c7a7",
    },
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(1),
    backgroundColor: "#47c7a7",
    color: "white",
  },
}));

const AddLeaveModal = ({
  open,
  onClose,
  onSave,
  generateId,
  setEvents,
  setOpenAddLeaveModal,
  events, // Receive events as a prop
}) => {
  const classes = useStyles();
  const [holidayName, setHolidayName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [leaveType, setLeaveType] = useState("Plan");
  const [leaves, setLeaves] = useState([]);

  const handleClose = () => {
    setHolidayName("");
    setStartDate(null);
    setEndDate(null);
    onClose();
  };
  const handleAddLeave = (leaveData) => {
    const id = generateId();
    const newLeave = {
      id,
      ...leaveData,
      color: "red",
    };
    setLeaves([...leaves, newLeave]);
    setOpenAddLeaveModal(false);
  };

  const handleSave = () => {
    const leaveData = {
      holidayName,
      startDate,
      endDate,
      leaveType,
    };
    onSave(leaveData); // Call onSave prop to pass leave data to the parent component
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <LocalizationProvider dateAdapter={DateFnsAdapter}>
        <div className={classes.paper}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4 style={{ color: "#47c7a7" }}>Add Leave</h4>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.inputContainer}>
            <TextField
              className={classes.input}
              label="Holiday Name"
              variant="outlined"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
            />
            <DatePicker
              className={classes.input}
              label="Start Date"
              inputFormat="MM/dd/yyyy"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div className={classes.inputContainer}>
            <DatePicker
              className={classes.input}
              label="End Date"
              inputFormat="MM/dd/yyyy"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
            <TextField
              select
              className={classes.input}
              label="Select Type"
              variant="outlined"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <MenuItem value="Plan">Plan</MenuItem>
              <MenuItem value="UnPlan">UnPlan</MenuItem>
            </TextField>
          </div>
          <div className={classes.buttonGroup}>
            <Button onClick={handleClose} style={{ color: "#47c7a7" }}>
              Close
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </LocalizationProvider>
    </Modal>
  );
};

export default AddLeaveModal;
