import React, { useState } from "react";
import { TextField, FormControl } from "@mui/material";
const SearchCheckList = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <FormControl>
      <TextField
        variant="outlined"
        size="small" // Set the size to "small" to reduce the height
        placeholder="Search..."
        fullWidth
        onChange={(e) => onSearch(e.target.value)}
        sx={{ mt: 2, mb: 2 }} // Adjust margin as needed
      />
    </FormControl>
  );
};

export default SearchCheckList;
