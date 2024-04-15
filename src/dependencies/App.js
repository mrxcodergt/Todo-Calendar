import React from "react";
import EventCalendar from "../components/EventCalender";
import CssBaseline from "@mui/material/CssBaseline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CssBaseline />
      <EventCalendar />
    </DndProvider>
  );
}

export default App;
