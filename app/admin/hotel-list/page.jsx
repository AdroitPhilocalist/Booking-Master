import React from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const users = [
  { username: "helloworld1", email: "hello@gmail.com", mobile: "999788787", status: "Active" },
  { username: "hotelren", email: "hotel1@gmail.com", mobile: "767636735", status: "Deactivate" },
  { username: "hotelsaa", email: "hotelsara@gmail.com", mobile: "872667676", status: "Active" },
  { username: "hote.rer", email: "hotel6@gmail.com", mobile: "676666787", status: "Active" },
];

export default function HotelList() {
  return (
    <Box sx={{ p: 4, maxWidth: "1000px", mx: "auto", boxShadow: 2, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>Total View</Typography>
          <Select defaultValue={6} size="small">
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </Box>
        <TextField size="small" placeholder="Search user" />
        <Button variant="contained" color="success">Add User</Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    color={user.status === "Active" ? "success" : "error"}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {user.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography>
          <span style={{ color: "blue", cursor: "pointer" }}>Prev</span> 1 2 3 .... 8 10{" "}
          <span style={{ color: "blue", cursor: "pointer" }}>Next</span>
        </Typography>
      </Box>
    </Box>
  );
}