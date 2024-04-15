import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CommentIcon from "@mui/icons-material/Comment";
import CategoryIcon from "@mui/icons-material/Category";
import DoneIcon from "@mui/icons-material/Done";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import TextsmsIcon from "@mui/icons-material/Textsms";
import FormatColorFillIcon from "@material-ui/icons/FormatColorFill";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import GroupIcon from "@material-ui/icons/Group";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns as DateFnsAdapter } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SketchPicker } from "react-color";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 700,
    maxHeight: 500,
    overflowY: "auto",
  },
  input: {
    margin: theme.spacing(1),
    "& input": {
      height: 8,
      fontSize: "0.8rem",
      color: "#000",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#47c7a7",
    },
  },
  colorPicker: {
    position: "absolute",
    zIndex: 10,
    top: "100%",
    right: 0,
  },
}));

const AddChecklistModal = ({ open, onClose, onSave }) => {
  const classes = useStyles();
  const [checklistData, setChecklistData] = useState({
    title: "",
    startDate: null,
    endDate: null,
    description: "",
    status: "",
    priority: "",
    category: "",
    comment: "",
    color: "#000000", // Initial color value
    subChecklists: [], // Array to hold subchecklists
  });
  console.log(checklistData);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  useEffect(() => {
    // Add event listener to detect clicks outside of the color picker
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setShowColorPicker(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChecklistData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setShowColorPicker(false); // Close color picker when other fields are selected
  };

  const handleDateChange = (name, newValue) => {
    setChecklistData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    setShowColorPicker(false); // Close color picker when other fields are selected
  };

  const handleClose = () => {
    setChecklistData({
      title: "",
      startDate: null,
      endDate: null,
      description: "",
      status: "",
      priority: "",
      category: "",
      comment: "",
      color: "#000000", // Initial color value
      subChecklists: [], // Reset subchecklists
    });
    onClose();
  };

  const handleSave = () => {
    onSave(checklistData);
    setChecklistData({
      title: "",
      startDate: null,
      endDate: null,
      description: "",
      status: "",
      priority: "",
      category: "",
      comment: "",
      color: "#000000", // Initial color value
      subChecklists: [], // Reset subchecklists
    });
    onClose();
  };

  const handleColorChange = (newColor) => {
    setChecklistData((prevData) => ({
      ...prevData,
      color: newColor.hex,
    }));
    setShowColorPicker(false); // Close color picker after selecting color
  };

  const handleAddSubChecklist = () => {
    const newSubChecklist = {
      id: generateId(),
      title: "New Sub Checklist",
      completed: false,
    };
    setChecklistData((prevData) => ({
      ...prevData,
      subChecklists: [...prevData.subChecklists, newSubChecklist],
    }));
  };

  const handleDeleteSubChecklist = (subChecklistId) => {
    setChecklistData((prevData) => ({
      ...prevData,
      subChecklists: prevData.subChecklists.filter(
        (subChecklist) => subChecklist.id !== subChecklistId
      ),
    }));
  };

  const handleEditSubChecklist = (subChecklistId, newTitle) => {
    setChecklistData((prevData) => ({
      ...prevData,
      subChecklists: prevData.subChecklists.map((subChecklist) =>
        subChecklist.id === subChecklistId
          ? { ...subChecklist, title: newTitle }
          : subChecklist
      ),
    }));
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <LocalizationProvider dateAdapter={DateFnsAdapter}>
        <div className={classes.paper}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h4 style={{ color: "#47c7a7" }}>Add Checklist</h4>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <CalendarTodayIcon />
            <TextField
              className={classes.input}
              label="Title"
              name="title"
              value={checklistData.title}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "40px",
              marginBottom: 10,
            }}
          >
            <DatePicker
              label="Start Date"
              inputFormat="MM/dd/yyyy"
              value={checklistData.startDate}
              className={classes.input}
              onChange={(newValue) => handleDateChange("startDate", newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            &nbsp;
            <DatePicker
              label="End Date"
              inputFormat="MM/dd/yyyy"
              value={checklistData.endDate}
              className={classes.input}
              onChange={(newValue) => handleDateChange("endDate", newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <CheckBoxOutlineBlankIcon />
            <TextField
              className={classes.input}
              label="No Repeat"
              variant="outlined"
              fullWidth
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <CommentIcon />
            <TextField
              className={classes.input}
              label="Description"
              name="description"
              value={checklistData.description}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <DoneIcon />
            <TextField
              className={classes.input}
              label="Status"
              name="status"
              value={checklistData.status}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
            <PriorityHighIcon />
            <TextField
              className={classes.input}
              label="Priority"
              name="priority"
              value={checklistData.priority}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />

            <CategoryIcon />
            <TextField
              className={classes.input}
              label="Category"
              name="category"
              value={checklistData.category}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <TextsmsIcon />
            <TextField
              className={classes.input}
              label="Comment"
              name="comment"
              value={checklistData.comment}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
            <div style={{ position: "relative" }}>
              <IconButton
                onClick={() => setShowColorPicker(!showColorPicker)}
                style={{ marginRight: "8px" }}
              >
                <FormatColorFillIcon style={{ color: checklistData.color }} />
              </IconButton>
              {showColorPicker && (
                <div className={classes.colorPicker} ref={colorPickerRef}>
                  <SketchPicker
                    color={checklistData.color}
                    onChange={handleColorChange}
                  />
                </div>
              )}
            </div>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
          >
            <CheckBoxOutlineBlankIcon />
            <TextField
              select
              className={classes.input}
              label="None"
              variant="outlined"
              fullWidth
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
            </TextField>
            <LockOpenIcon />
            <TextField
              select
              className={classes.input}
              label="Read Only"
              variant="outlined"
              fullWidth
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
            </TextField>
            <GroupIcon />
            <TextField
              className={classes.input}
              label="Send Individual"
              variant="outlined"
              fullWidth
            />
          </div>
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <Button onClick={handleClose} style={{ color: "#47c7a7" }}>
              Close
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              style={{
                marginLeft: "10px",
                backgroundColor: "#47c7a7",
                color: "white",
              }}
            >
              Save
            </Button>
          </div>
          {/* Add Subchecklist section */}
          <h4 style={{ color: "#47c7a7", marginTop: "20px" }}>
            Add Subchecklist
          </h4>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              className={classes.input}
              label="Title"
              variant="outlined"
              fullWidth
            />
            <IconButton onClick={handleAddSubChecklist}>
              <AddBoxIcon />
            </IconButton>
          </div>
          {checklistData.subChecklists.map((subChecklist, index) => (
            <SubChecklistCard
              key={subChecklist.id}
              subChecklist={subChecklist}
              onDelete={() => handleDeleteSubChecklist(subChecklist.id)}
              onEdit={(newTitle) =>
                handleEditSubChecklist(subChecklist.id, newTitle)
              }
            />
          ))}
        </div>
      </LocalizationProvider>
    </Modal>
  );
};

const SubChecklistCard = ({ subChecklist, onDelete, onEdit }) => {
  console.log(subChecklist);
  const [completed, setCompleted] = useState(subChecklist.completed);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(subChecklist.title);

  const handleCompleteToggle = () => {
    setCompleted(!completed);
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleEdit = () => {
    onEdit(newTitle);
    setEditing(false);
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        my: 1,
      }}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={handleCompleteToggle}
        style={{ marginRight: "10px" }}
      />
      {editing ? (
        <TextField
          value={newTitle}
          onChange={handleTitleChange}
          autoFocus
          onBlur={handleEdit}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleEdit();
            }
          }}
          style={{ marginRight: "10px" }}
        />
      ) : (
        <Typography variant="body2" style={{ marginRight: "10px" }}>
          {subChecklist.title}
        </Typography>
      )}
      <IconButton onClick={handleEditToggle} style={{ marginRight: "10px" }}>
        <EditOutlined fontSize="small" style={{ color: "green" }} />
      </IconButton>
      <IconButton onClick={handleDelete} style={{ marginRight: "10px" }}>
        <DeleteOutline fontSize="small" style={{ color: "red" }} />
      </IconButton>
    </Box>
  );
};

export default AddChecklistModal;
