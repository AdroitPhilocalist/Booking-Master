"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Footer } from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RestaurantList() {
  const router = useRouter();

  const [restaurantItems, setRestaurantItems] = useState([]);
  const [error, setError] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/menuItem");
        const result = await response.json();

        if (result.success) {
          setRestaurantItems(result.data);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };

  const handleEditSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/menuItem/${selectedItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedItem),
      });

      const result = await response.json();

      if (result.success) {
        setRestaurantItems(
          (prev) =>
            prev.map((item) =>
              item._id === selectedItem._id ? result.data : item
            )
          //toast.success("");
        );
        toast.success("Item updated succesfully");
        setOpenEditModal(false);
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error("Error updating item:", err);
      toast.error("Error updating item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/menuItem/${selectedItem._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setRestaurantItems((prev) =>
          prev.filter((item) => item._id !== selectedItem._id)
        );
        toast.success("Item deleted successfully");
        setOpenDeleteDialog(false);
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Error deleting item:");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <div>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="bg-amber-50 min-h-screen">
        <Box>
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                <svg
                  aria-hidden="true"
                  className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="mt-4 text-gray-700">
                  Loading Restaurant Menus...
                </span>
              </div>
            </div>
          )}
          <Box
            sx={{ padding: 4, justifyItems: "flex-end" }}
            style={{ maxWidth: "80%", margin: "0 auto" }}
          >
            <Typography
              variant="h4"
              sx={{ color: "#064c61", fontWeight: "bold" }}
              style={{ maxWidth: "80%", margin: "0 auto" }}
            >
              Restaurant Menu
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
              style={{ maxWidth: "80%", margin: "0 auto" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push("/Restaurant/restaurantmenu/add")}
                sx={{ minWidth: "150px" }}
                className="mb-4"
              >
                Add New Item
              </Button>
            </Box>
            <TableContainer
              component={Paper}
              style={{ maxWidth: "80%", margin: "0 auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>
                      Item Code
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>
                      Segment
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>
                      Price (INR)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {restaurantItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.itemCategory}</TableCell>
                      <TableCell>{item.itemSegment}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditClick(item)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteClick(item)}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Edit Modal */}
          <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Item Code"
                fullWidth
                disabled // Item Code should not be editable as it's unique
                value={selectedItem?.itemCode || ""}
              />
              <TextField
                margin="dense"
                label="Item Category"
                fullWidth
                value={selectedItem?.itemCategory || ""}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    itemCategory: e.target.value,
                  }))
                }
              />
              <TextField
                margin="dense"
                label="Item Segment"
                fullWidth
                value={selectedItem?.itemSegment || ""}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    itemSegment: e.target.value,
                  }))
                }
              />
              <TextField
                margin="dense"
                label="Item Name"
                fullWidth
                value={selectedItem?.itemName || ""}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    itemName: e.target.value,
                  }))
                }
              />
              <TextField
                margin="dense"
                label="Price"
                type="number"
                fullWidth
                value={selectedItem?.price || ""}
                onChange={(e) => {
                  const price = parseFloat(e.target.value) || 0;
                  const sgst = parseFloat(selectedItem.sgst || 0);
                  const cgst = parseFloat(selectedItem.cgst || 0);
                  const gst = sgst + cgst;
                  const total = ((100 + gst) / 100) * price;
                  setSelectedItem((prev) => ({
                    ...prev,
                    price,
                    total: total.toFixed(2),
                  }));
                }}
              />
              <TextField
                margin="dense"
                label="SGST (%)"
                type="number"
                fullWidth
                value={selectedItem?.sgst || ""}
                onChange={(e) => {
                  const sgst = parseFloat(e.target.value) || 0;
                  const price = parseFloat(selectedItem.price || 0);
                  const cgst = parseFloat(selectedItem.cgst || 0);
                  const gst = sgst + cgst;
                  const total = ((100 + gst) / 100) * price;
                  setSelectedItem((prev) => ({
                    ...prev,
                    sgst,
                    total: total.toFixed(2),
                  }));
                }}
              />
              <TextField
                margin="dense"
                label="CGST (%)"
                type="number"
                fullWidth
                value={selectedItem?.cgst || ""}
                onChange={(e) => {
                  const cgst = parseFloat(e.target.value) || 0;
                  const price = parseFloat(selectedItem.price || 0);
                  const sgst = parseFloat(selectedItem.sgst || 0);
                  const gst = sgst + cgst;
                  const total = ((100 + gst) / 100) * price;
                  setSelectedItem((prev) => ({
                    ...prev,
                    cgst,
                    total: total.toFixed(2),
                  }));
                }}
              />
              {/* Read-only GST Field */}
              <TextField
                margin="dense"
                label="GST (%)"
                type="number"
                fullWidth
                value={
                  (
                    parseFloat(selectedItem?.sgst || 0) +
                    parseFloat(selectedItem?.cgst || 0)
                  ).toFixed(2) || ""
                }
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                label="Total (incl. GST)"
                type="number"
                fullWidth
                value={selectedItem?.total || ""}
                onChange={(e) => {
                  const total = parseFloat(e.target.value) || 0;
                  const sgst = parseFloat(selectedItem.sgst || 0);
                  const cgst = parseFloat(selectedItem.cgst || 0);
                  const gst = sgst + cgst;
                  const price = total / ((100 + gst) / 100);
                  setSelectedItem((prev) => ({
                    ...prev,
                    total,
                    price: price.toFixed(2),
                  }));
                }}
              />
              <TextField
                margin="dense"
                label="Show in Profile"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={selectedItem?.showInProfile || ""}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    showInProfile: e.target.value,
                  }))
                }
              >
                <option value="Yes (Visible)">Yes (Visible)</option>
                <option value="No (Hidden)">No (Hidden)</option>
              </TextField>
              <TextField
                margin="dense"
                label="Is Special Item"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={selectedItem?.isSpecialItem || ""}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    isSpecialItem: e.target.value,
                  }))
                }
              >
                <option value="Yes (Editable)">Yes (Editable)</option>
                <option value="No (Not Editable)">No (Not Editable)</option>
              </TextField>
              <TextField
                margin="dense"
                label="Discount Allowed"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={selectedItem?.discountAllowed || ""}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    discountAllowed: e.target.value,
                  }))
                }
              >
                <option value="Yes (Allowed)">Yes (Allowed)</option>
                <option value="No (Not Allowed)">No (Not Allowed)</option>
              </TextField>
              <TextField
                margin="dense"
                label="Store Item Code"
                fullWidth
                value={selectedItem?.storeItemCode || ""}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    storeItemCode: e.target.value,
                  }))
                }
              />
              <TextField
                margin="dense"
                label="Ingredient Code"
                fullWidth
                value={selectedItem?.ingredientCode || ""}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    ingredientCode: e.target.value,
                  }))
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
              <Button onClick={handleEditSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this menu item?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
      <Footer />
    </div>
  );
}
