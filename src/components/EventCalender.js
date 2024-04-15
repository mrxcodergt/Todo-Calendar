import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DndProvider } from "react-dnd";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddChecklistModal from "./AddCheckList";
import AddLeaveModal from "./AddLeaveModal";
import SearchCheckList from "./SearchCheckList";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import TodayIcon from "@mui/icons-material/Today";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  DeleteOutline,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const generateId = () => (Math.floor(Math.random() * 10000) + 1).toString();

const EventCalendar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openChecklistModal, setOpenChecklistModal] = useState(false);
  const [openAddLeaveModal, setOpenAddLeaveModal] = useState(false);
  const [checklists, setChecklists] = useState(() => {
    const storedChecklists = localStorage.getItem("checklists");
    return storedChecklists ? JSON.parse(storedChecklists) : [];
  });
  const [leaves, setLeaves] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("month");

  useEffect(() => {
    const storedChecklists = localStorage.getItem("checklists");
    if (storedChecklists) {
      setChecklists(JSON.parse(storedChecklists));
    }
  }, []);

  const handleToggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleAddChecklist = (checklistData) => {
    const id = generateId();
    const newChecklist = {
      id,
      title: checklistData.title,
      start: new Date(checklistData.startDate),
      end: new Date(checklistData.endDate),
      color: checklistData.color,
      subChecklists: [],
    };
    newChecklist.end.setDate(newChecklist.end.getDate() + 1);

    setChecklists([...checklists, newChecklist]);
    setEvents([...events, newChecklist]);
    setOpenChecklistModal(false);
  };

  const handleAddLeave = (leaveData) => {
    const id = generateId();
    const newLeave = {
      id,
      title: leaveData.holidayName,
      start: new Date(leaveData.startDate),
      end: new Date(leaveData.endDate),
      color: "#990000",
    };
    newLeave.end.setDate(newLeave.end.getDate() + 1);

    const isDuplicate = events.some(
      (event) =>
        event.title === newLeave.title &&
        event.start.getTime() === newLeave.start.getTime() &&
        event.end.getTime() === newLeave.end.getTime()
    );

    if (isDuplicate) {
      setOpenAddLeaveModal(false);
      return;
    }

    setEvents([...events, newLeave]);
    setOpenAddLeaveModal(false);
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearAllChecklists = () => {
    setChecklists([]);
  };

  const filteredChecklists = checklists.filter((checklist) =>
    checklist.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrop = (event) => {
    const { id, date } = event;
    const droppedChecklist = checklists.find(
      (checklist) => checklist.id === id
    );
    const newEvent = {
      id: generateId(),
      title: droppedChecklist.title,
      start: date,
      end: date,
      color: droppedChecklist.color || "grey",
    };
    setEvents([...events, newEvent]);
  };

  const handleEditChecklist = (id, currentTitle) => {
    const newTitle = prompt("Enter new title:", currentTitle);
    if (newTitle !== null) {
      setChecklists((prevChecklists) =>
        prevChecklists.map((checklist) =>
          checklist.id === id ? { ...checklist, title: newTitle } : checklist
        )
      );
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave.id === id ? { ...leave, title: newTitle } : leave
        )
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, title: newTitle } : event
        )
      );
    }
  };

  const handleDeleteChecklist = (id) => {
    setChecklists(checklists.filter((checklist) => checklist.id !== id));
    setLeaves(leaves.filter((leave) => leave.id !== id));
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleAddSubChecklist = (id) => {
    const newSubChecklist = {
      id: generateId(),
      title: "New Sub Checklist",
      completed: false,
    };
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === id
          ? {
              ...checklist,
              subChecklists: [...checklist.subChecklists, newSubChecklist],
            }
          : checklist
      )
    );
  };

  const handleDeleteSubChecklist = (checklistId, subChecklistId) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              subChecklists: checklist.subChecklists.filter(
                (subChecklist) => subChecklist.id !== subChecklistId
              ),
            }
          : checklist
      )
    );
  };

  const handleEditSubChecklist = (checklistId, subChecklistId, newTitle) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              subChecklists: checklist.subChecklists.map((subChecklist) =>
                subChecklist.id === subChecklistId
                  ? { ...subChecklist, title: newTitle }
                  : subChecklist
              ),
            }
          : checklist
      )
    );
  };

  const handleDropSubChecklist = (checklistId, item) => {
    const checklist = checklists.find((c) => c.id === checklistId);
    const newEvent = {
      id: generateId(),
      title: item.title,
      start: item.date,
      end: item.date,
      color: "grey",
    };
    setEvents([...events, newEvent]);
    setChecklists((prevChecklists) =>
      prevChecklists.map((c) =>
        c.id === checklistId
          ? {
              ...c,
              subChecklists: c.subChecklists.filter(
                (subChecklist) => subChecklist.id !== item.id
              ),
            }
          : c
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        mt={2}
        mb={2}
        component="main"
        sx={{
          flexGrow: 0,
          py: 0,
          px: 0,
          width: openSidebar ? "calc(100% - 450px)" : "100%",
        }}
      >
        <Container maxWidth={false}>
          <Card>
            <CardHeader
              title="MY TODO'S"
              sx={{ fontSize: "1.2rem", color: "blue" }}
              action={
                <Button
                  onClick={handleToggleSidebar}
                  variant="text"
                  sx={{ color: "grey" }}
                >
                  <MenuIcon fontSize="medium" />
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Calendar
                localizer={localizer}
                events={[...events, ...leaves]}
                selectable
                startAccessor="start"
                endAccessor="end"
                defaultView={currentView}
                views={{ month: true, week: true, day: true }}
                style={{ height: 600 }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.color || "red",
                    borderColor: event.color || "red",
                  },
                })}
                onEventDrop={handleDrop}
                onView={(view) => setCurrentView(view)}
                components={{
                  toolbar: (toolbar) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <IconButton onClick={() => toolbar.onNavigate("PREV")}>
                          <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={() => toolbar.onNavigate("NEXT")}>
                          <ChevronRightIcon />
                        </IconButton>
                      </div>
                      <div>
                        <Button
                          variant="text"
                          onClick={() => toolbar.onView("month")}
                        >
                          Month
                        </Button>
                        <Button
                          variant="text"
                          onClick={() => toolbar.onView("week")}
                        >
                          Week
                        </Button>
                        <Button
                          variant="text"
                          onClick={() => toolbar.onView("day")}
                        >
                          Day
                        </Button>
                      </div>
                    </div>
                  ),
                  event: ({ event }) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "25px",
                      }}
                    >
                      <div>{event.title}</div>
                      <Box sx={{ ml: "auto" }}>
                        <IconButton size="small" sx={{ padding: 0 }}>
                          <VisibilityOutlined
                            fontSize="small"
                            sx={{ color: "blue" }}
                          />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ padding: 0 }}
                          onClick={() =>
                            handleEditChecklist(event.id, event.title)
                          }
                        >
                          <EditOutlined
                            fontSize="small"
                            sx={{ color: "green" }}
                          />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ padding: 0 }}
                          onClick={() => handleDeleteChecklist(event.id)}
                        >
                          <DeleteOutline
                            fontSize="small"
                            sx={{ color: "red" }}
                          />
                        </IconButton>
                      </Box>
                    </div>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </Container>
        {openSidebar && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 450,
              height: "100%",
              backgroundColor: "#fff",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            <Box p={1}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", py: 2 }}>
                <Button onClick={handleCloseSidebar} variant="text">
                  <CloseIcon />
                </Button>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                <Button
                  onClick={() => setOpenChecklistModal(true)}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#47c7a7",
                    "&:hover": { backgroundColor: "#47c7a7" },
                  }}
                >
                  Add Checklist
                </Button>
                <Button
                  onClick={() => setOpenAddLeaveModal(true)}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#47c7a7",
                    "&:hover": { backgroundColor: "#47c7a7" },
                  }}
                >
                  Add Leave
                </Button>
                <Button
                  onClick={handleClearAllChecklists}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#47c7a7",
                    "&:hover": { backgroundColor: "#47c7a7" },
                  }}
                >
                  Clear All
                </Button>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TodayIcon />
                <Box>
                  <SearchCheckList onSearch={handleSearch} />
                </Box>
              </Box>

              {filteredChecklists.map((checklist, index) => (
                <ChecklistCard
                  key={checklist.id}
                  index={index}
                  checklist={checklist}
                  handleAddSubChecklist={handleAddSubChecklist}
                  handleDeleteSubChecklist={handleDeleteSubChecklist}
                  handleEditSubChecklist={handleEditSubChecklist}
                  handleDropSubChecklist={handleDropSubChecklist}
                />
              ))}
            </Box>
          </Box>
        )}
        <AddChecklistModal
          open={openChecklistModal}
          onClose={() => setOpenChecklistModal(false)}
          onSave={handleAddChecklist}
        />
        <AddLeaveModal
          open={openAddLeaveModal}
          onClose={() => setOpenAddLeaveModal(false)}
          onSave={handleAddLeave}
          generateId={generateId}
          setEvents={setEvents}
          setOpenAddLeaveModal={setOpenAddLeaveModal}
        />
      </Box>
    </DndProvider>
  );
};
const ChecklistCard = ({
  checklist,
  handleAddSubChecklist,
  handleDeleteSubChecklist,
  handleEditSubChecklist,
  handleDropSubChecklist,
}) => {
  const [minimized, setMinimized] = useState(false);

  const handleMinimize = () => {
    setMinimized(!minimized);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "SUB_CHECKLIST",
    drop: (item) => handleDropSubChecklist(checklist.id, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop}>
      <Card sx={{ my: 2, border: "1px solid grey" }}>
        <CardHeader
          title={checklist.title}
          titleTypographyProps={{ variant: "body2" }}
          sx={{ borderBottom: "1px solid #47c7a7", paddingBottom: 1 }}
          action={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2">Today</Typography>
              <Button size="small" onClick={handleMinimize}>
                {minimized ? "-" : "+"}
              </Button>
            </Box>
          }
        />
        <Divider sx={{ bgcolor: "#47c7a7" }} />
        {!minimized && (
          <CardContent>
            {checklist.subChecklists.map((subChecklist, subIndex) => (
              <SubChecklistCard
                key={subChecklist.id}
                index={subIndex}
                checklistId={checklist.id}
                subChecklist={subChecklist}
                onDelete={() =>
                  handleDeleteSubChecklist(checklist.id, subChecklist.id)
                }
                onEdit={(newTitle) =>
                  handleEditSubChecklist(
                    checklist.id,
                    subChecklist.id,
                    newTitle
                  )
                }
              />
            ))}
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              Add a Sub Checklist
              <IconButton
                onClick={() => handleAddSubChecklist(checklist.id)}
                size="small"
              >
                +
              </IconButton>
            </Typography>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

const SubChecklistCard = ({ subChecklist, onDelete, onEdit }) => {
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

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SUB_CHECKLIST",
    item: { id: subChecklist.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag}
      sx={{
        display: "flex",
        alignItems: "center",
        my: 1,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <input
        type="radio"
        checked={completed}
        onChange={handleCompleteToggle}
        style={{ width: "20px", height: "20px" }}
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
        />
      ) : (
        <Typography variant="body2" sx={{ fontSize: "1rem", flex: 1 }}>
          {subChecklist.title}
        </Typography>
      )}
      <Box sx={{ ml: "auto" }}>
        <IconButton>
          <VisibilityOutlined fontSize="small" sx={{ color: "blue" }} />
        </IconButton>
        <IconButton size="small" variant="text" onClick={handleEditToggle}>
          <EditOutlined fontSize="small" sx={{ color: "green" }} />
        </IconButton>
        <IconButton size="small" variant="text" onClick={handleDelete}>
          <DeleteOutline fontSize="small" sx={{ color: "red" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default EventCalendar;
