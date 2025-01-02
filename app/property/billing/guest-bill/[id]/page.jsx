"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../../_components/Navbar";
import { Footer } from "../../../../_components/Footer";
import axios from "axios";
import PrintableRoomInvoice from "./printRoomInvoice";
import PrintableServiceInvoice from "./printServiceInvoice";
import PrintableFoodInvoice from "./printFoodInvoice";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const BookingDashboard = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRoomInvoiceModal, setOpenRoomInvoiceModal] = useState(false);
  const [openServiceInvoiceModal, setOpenServiceInvoiceModal] = useState(false);

  // New state for services modal
  const [openServicesModal, setOpenServicesModal] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceTax, setServiceTax] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceTotal, setServiceTotal] = useState("");
  const [services, setServices] = useState([]);

  // New state for food modal
  const [menuItems, setMenuItems] = useState([]);
  const [openFoodModal, setOpenFoodModal] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodTax, setFoodTax] = useState("");

  const [foods, setFoods] = useState([]);
  // Add new state for separating food and service items
  const [foodItems, setFoodItems] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);

  // New state for bill payment modal
  const [openBillPaymentModal, setOpenBillPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [remainingDueAmount, setRemainingDueAmount] = useState(0);

  // Add new state variables for managing food items
  const [selectedFoodItems, setSelectedFoodItems] = useState([]); // Array to store multiple food items
  const [foodQuantity, setFoodQuantity] = useState(1);


  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {

        // Fetch menu items first to compare
        const menuResponse = await axios.get("/api/menuItem");
        const menuItemsList = menuResponse.data.data;

        // 1. First fetch billing details
        const billingResponse = await axios.get(`/api/Billing/${id}`);
        const billingData = billingResponse.data.data;

        // 2. Fetch existing services if any
        const existingServices = billingData.itemList || [];
        const existingPrices = billingData.priceList || [];
        const existingTaxes = billingData.taxList || [];
        const existingQuantities = billingData.quantityList || [];

        const foodItemsArray = [];
        const serviceItemsArray = [];

        // setServices(
        //   existingServices.map((item, index) => ({
        //     name: item,
        //     price: existingPrices[index] || 0,
        //     quantity: billingData.quantityList[index] || 1,
        //     tax: existingTaxes[index] || 0,
        //   }))
        // );

        existingServices.forEach((item, index) => {
          const menuItem = menuItemsList.find(
            menuItem => menuItem.itemName === item
          );

          const itemDetails = {
            name: item,
            price: existingPrices[index] || 0,
            quantity: existingQuantities[index] || 1,
            tax: existingTaxes[index] || 0,
          };

          if (menuItem) {
            foodItemsArray.push(itemDetails);
          } else if (item !== 'Room Charge') {
            serviceItemsArray.push(itemDetails);
          }
        });

        setFoodItems(foodItemsArray);
        setServiceItems(serviceItemsArray);
        setServices([
          ...serviceItemsArray,
          ...foodItemsArray
        ]);

        // 3. Fetch and find matched room
        const roomsResponse = await axios.get("/api/rooms");
        const matchedRoom = roomsResponse.data.data.find(
          (room) => room.number === billingData.roomNo
        );

        if (!matchedRoom) {
          throw new Error("No matching room found");
        }

        // 4. Fetch bookings and match using currentGuestId
        const newBookingsResponse = await axios.get("/api/NewBooking");
        const matchedBooking = newBookingsResponse.data.data.find(
          (booking) => booking._id === matchedRoom.currentGuestId
        );

        if (!matchedBooking) {
          throw new Error("No matching booking found");
        }

        // 5. Fetch room category details
        const roomCategoriesResponse = await axios.get("/api/roomCategories");
        const matchedCategory = roomCategoriesResponse.data.data.find(
          (category) => category._id === matchedRoom.category._id
        );

        // Calculate due amount
        const dueAmount = billingData.dueAmount;
        setRemainingDueAmount(dueAmount);

        // Combine all fetched data
        setBookingData({
          billing: billingData,
          booking: matchedBooking,
          room: matchedRoom,
          category: matchedCategory,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching booking details:", err);
      }
    };

    fetchBookingDetails();
  }, [id]);

  useEffect(() => {
    if (servicePrice && serviceTax) {
      const price = parseFloat(servicePrice);
      const taxRate = parseFloat(serviceTax);
      const total = price + (price * taxRate / 100);
      setServiceTotal(total.toFixed(2));
    } else {
      setServiceTotal("");
    }
  }, [servicePrice, serviceTax]);

  useEffect(() => {
    // Fetch menu items
    const fetchMenuItems = async () => {
      try {
        const menuResponse = await axios.get("/api/menuItem");
        setMenuItems(menuResponse.data.data);
        console.log(menuResponse.data.data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };

    fetchMenuItems();
  }, []);


  // Modal style
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Handle opening services modal
  const handleOpenServicesModal = () => {
    setOpenServicesModal(true);
    setServiceName("");
    setServicePrice("");
    setServiceTax("");
    setServiceTotal("");
  };

  // Handle closing services modal
  const handleCloseServicesModal = () => {
    setOpenServicesModal(false);
    setServiceName("");
    setServicePrice("");
    setServiceTax("");
    setServiceTotal("");
  };

  // Handle opening room invoice modal
  const handleOpenRoomInvoiceModal = () => {
    setOpenRoomInvoiceModal(true);
  };

  // Handle closing room invoice modal
  const handleCloseRoomInvoiceModal = () => {
    setOpenRoomInvoiceModal(false);
  };

  // Handle opening service invoice modal
  const handleOpenServiceInvoiceModal = () => {
    setOpenServiceInvoiceModal(true);
  };

  // Handle closing service invoice modal
  const handleCloseServiceInvoiceModal = () => {
    setOpenServiceInvoiceModal(false);
  };

  // Add new function for printing food invoice
  const [openFoodInvoiceModal, setOpenFoodInvoiceModal] = useState(false);

  const handleOpenFoodInvoiceModal = () => {
    setOpenFoodInvoiceModal(true);
  };

  const handleCloseFoodInvoiceModal = () => {
    setOpenFoodInvoiceModal(false);
  };

  // Handle adding service
  const handleAddService = async () => {
    if (!serviceName || !servicePrice || !serviceTax) {
      alert("Please enter service name, price, and tax");
      return;
    }
    console.log(serviceName, servicePrice, serviceTax);
    console.log(id);
    try {
      // Prepare the data to update
      const response = await axios.put(`/api/Billing/${id}`, {
        itemList: [serviceName],
        priceList: [parseFloat(serviceTotal)],
        quantityList: [1], // Send quantity as 1
        taxList: [parseFloat(serviceTax)], // Send tax to taxList
      });
      console.log(response.data);
      // Update local state
      setServices([
        ...services,
        {
          name: serviceName,
          price: parseFloat(serviceTotal),
          tax: parseFloat(serviceTax)
        }
      ]);

      // Close modal and reset fields
      handleCloseServicesModal();
      window.location.reload();
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service");
    }
  };

  // Handle opening food modal
  const handleOpenFoodModal = () => {
    setOpenFoodModal(true);
    setSelectedFoodItem(null);
    setFoodName("");
    setFoodPrice("");
    setFoodTax("");
  };


  // Handle closing food modal
  const handleCloseFoodModal = () => {
    setOpenFoodModal(false);
  };

  const handleFoodItemChange = (event) => {
    const selectedItem = menuItems.find(item => item.itemName === event.target.value);
    if (selectedItem) {
      setSelectedFoodItem(selectedItem);
      setFoodName(selectedItem.itemName);
      setFoodPrice(selectedItem.price);
      setFoodTax(selectedItem.gst);
      setFoodQuantity(1); // Reset quantity when new item selected
    }
  };

  // Add function to handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setFoodQuantity(value);
    }
  };

  // Add function to add item to selected items list
  const handleAddToList = () => {
    if (!selectedFoodItem) {
      alert("Please select a food item");
      return;
    }

    const newItem = {
      ...selectedFoodItem,
      quantity: foodQuantity,
      totalPrice: selectedFoodItem.price * foodQuantity
    };

    setSelectedFoodItems([...selectedFoodItems, newItem]);

    // Reset selection fields
    setSelectedFoodItem(null);
    setFoodName("");
    setFoodPrice("");
    setFoodTax("");
    setFoodQuantity(1);
  };

  // Add function to remove item from list
  const handleRemoveItem = (index) => {
    const updatedItems = selectedFoodItems.filter((_, idx) => idx !== index);
    setSelectedFoodItems(updatedItems);
  };

  // Add function to update quantity in the list
  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = selectedFoodItems.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.price * newQuantity
        };
      }
      return item;
    });
    setSelectedFoodItems(updatedItems);
  };

  // Update handleAddFood function to handle multiple items
  const handleAddFood = async () => {
    if (selectedFoodItems.length === 0) {
      alert("Please add at least one food item");
      return;
    }

    try {
      const response = await axios.put(`/api/Billing/${id}`, {
        itemList: selectedFoodItems.map(item => item.itemName),
        priceList: selectedFoodItems.map(item => item.totalPrice),
        quantityList: selectedFoodItems.map(item => item.quantity),
        taxList: selectedFoodItems.map(item => parseFloat(item.gst))
      });

      console.log(response.data);

      // Update local state
      setServices([
        ...services,
        ...selectedFoodItems.map(item => ({
          name: item.itemName,
          price: item.totalPrice,
          tax: parseFloat(item.gst)
        }))
      ]);

      handleCloseFoodModal();
      window.location.reload();
    } catch (error) {
      console.error("Error adding food:", error);
      alert("Failed to add food");
    }
  };
  // Handle opening bill payment modal
  const handleOpenBillPaymentModal = () => {
    setOpenBillPaymentModal(true);
  };

  // Handle closing bill payment modal
  const handleCloseBillPaymentModal = () => {
    setOpenBillPaymentModal(false);
    setPaymentAmount("");
  };

  // Handle adding payment
  const handleAddPayment = async () => {
    const paymentAmountNum = Number(paymentAmount);

    if (!paymentAmount || paymentAmountNum <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    if (paymentAmountNum > remainingDueAmount) {
      alert(
        `Payment amount cannot exceed remaining due amount of ${remainingDueAmount}`
      );
      return;
    }
    if (!modeOfPayment) {
      alert("Please select a mode of payment");
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      // Prepare the data to update - note the conversion to number
      const response = await axios.put(`/api/Billing/${id}`, {
        amountAdvanced: paymentAmountNum + billing.amountAdvanced,
        DateOfPayment: [currentDate],
        ModeOfPayment: [modeOfPayment],
        AmountOfPayment: [paymentAmountNum],
      });

      // Update local state based on the server response
      const updatedBillingData = response.data.data;

      // Update booking data and remaining due amount from server response
      const updatedBookingData = { ...bookingData };
      updatedBookingData.billing = updatedBillingData;
      setBookingData(updatedBookingData);

      // Set remaining due amount from server response
      setRemainingDueAmount(updatedBillingData.dueAmount);

      // Close modal and reset fields
      handleCloseBillPaymentModal();
      setPaymentAmount("");
      setModeOfPayment("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding payment:", error);
      alert(error.response?.data?.error || "Failed to add payment");
    }
  };

  const handleCompletePayment = async () => {
    try {
      // Step 1: Update Billing API - Set Bill_Paid to "yes"
      const billingUpdateResponse = await axios.put(`/api/Billing/${id}`, {
        Bill_Paid: "yes",
        dueAmount: 0,
      });

      // Step 2: Get current room data
      const roomNo = room._id;
      const currentRoomResponse = await axios.get(`/api/rooms/${roomNo}`);
      const currentRoomData = currentRoomResponse.data.data;

      // Find the position of current IDs in the arrays
      const currentPosition = currentRoomData.billWaitlist.findIndex(
        billId => billId._id.toString() === billing._id.toString()
      );

      let updateData = {};

      // Check if there's a next guest/bill in the waitlists
      const hasNextBooking = currentPosition < currentRoomData.billWaitlist.length - 1;

      if (hasNextBooking) {
        // If there's a next booking, set it as current
        updateData = {
          currentBillingId: currentRoomData.billWaitlist[currentPosition + 1],
          currentGuestId: currentRoomData.guestWaitlist[currentPosition + 1],
          occupied: "Vacant",
          clean: true,
          billingStarted: "No"
        };
      } else {
        // If no next booking, reset current IDs
        updateData = {
          currentBillingId: null,
          currentGuestId: null,
          occupied: "Vacant",
          clean: true,
          billingStarted: "No"
        };
      }

      // Maintain all waitlists as they are
      updateData = {
        ...updateData,
        billWaitlist: currentRoomData.billWaitlist,
        guestWaitlist: currentRoomData.guestWaitlist,
        checkInDateList: currentRoomData.checkInDateList,
        checkOutDateList: currentRoomData.checkOutDateList
      };

      console.log("Update Data:", updateData);

      // Update room with new data
      const roomUpdateResponse = await axios.put(`/api/rooms/${roomNo}`, updateData);

      // Set payment complete state
      setRemainingDueAmount(0);
      alert("Payment completed successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error completing payment:", error);
      alert("Failed to complete payment");
    }
  };

  if (loading) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
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
        <span className="mt-4 text-gray-700">Loading Booking Data...</span>
      </div>
    </div>;
  }



  if (error) {
    return <div>Error: {error}</div>;
  }

  const { billing, booking, room, category } = bookingData;

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-800">
            Booking Dashboard{" "}
            <span className="text-gray-500">({booking.bookingId})</span>
          </h2>

          {/* Booking Information */}
          <div className="mt-4 bg-blue-100 p-4 rounded">
            <p className="text-lg font-semibold">
              {booking.guestName}{" "}
              <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
                Posting On
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Check-In:{" "}
              <strong>{new Date(booking.checkIn).toLocaleDateString('en-GB')}</strong> |
              Expected Check-Out:{" "}
              <strong>{new Date(booking.checkOut).toLocaleDateString('en-GB')}</strong> |
              Phone No: <strong>+91 {booking.mobileNo}</strong>
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Guest ID: <strong>{booking.guestid}</strong> | Date of
              Birth: <strong>{new Date(booking.dateofbirth).toLocaleDateString('en-GB')}
              </strong> | Booking Type:{" "}
              <strong>{booking.bookingType}</strong> | Booking Source:{" "}
              <strong>{booking.bookingSource}</strong>
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Booked On:{" "}
              <strong>
                {new Date(booking.createdAt).toLocaleDateString('en-GB')}
              </strong>{" "}
              | PAX:{" "}
              <strong>
                {booking.adults} Adult {booking.children} Child
              </strong>{" "}
              | Meal Plan: <strong>{booking.mealPlan}</strong> | Notes:{" "}
              <strong>{booking.remarks || "-"}</strong>
            </p>
          </div>

          {/* Rooms Booked */}
          <div className="mt-6 bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-gray-800">Rooms Booked</h3>
            <p className="text-sm text-gray-700">
              {new Date(booking.checkIn).toLocaleDateString()} (
              {new Date(booking.checkIn).toLocaleString("default", {
                weekday: "short",
              })}
              ) (1) &raquo; Room No.: {billing.roomNo}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-3 md:grid-cols-3 gap-3">
            {[
              {
                label: "Add Services",
                color: "primary",
                variant: "contained",
                onClick: handleOpenServicesModal,
                disabled: billing.Bill_Paid === "yes",
              },
              {
                label: "Add Food",
                color: "success",
                variant: "contained",
                onClick: handleOpenFoodModal,
                disabled: billing.Bill_Paid === "yes",
              },
              {
                label: "Bill Payment",
                color: remainingDueAmount <= 0 ? "secondary" : "error",
                variant: "contained",
                onClick:
                  remainingDueAmount > 0
                    ? handleOpenBillPaymentModal
                    : undefined,
                disabled: remainingDueAmount <= 0,
              },
            ].map((btn, index) => (
              <Button
                key={index}
                variant={btn.variant}
                color={btn.color}
                onClick={btn.onClick}
                disabled={btn.disabled}
                fullWidth
              >
                {btn.label}
              </Button>
            ))}
          </div>
          {/* Bill Payment Modal */}
          <Modal
            open={openBillPaymentModal}
            onClose={handleCloseBillPaymentModal}
            aria-labelledby="bill-payment-modal"
          >
            <Box sx={modalStyle}>
              <Typography id="bill-payment-modal" variant="h6" component="h2">
                Bill Payment
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Payment Amount"
                type="number"
                helperText={`Remaining Due: ₹${remainingDueAmount.toFixed(2)}`}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                inputProps={{
                  max: remainingDueAmount,
                  min: 0,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                select
                label="Mode of Payment"
                value={modeOfPayment}
                onChange={(e) => setModeOfPayment(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="" disabled></option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Other">Other</option>
              </TextField>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPayment}
                  disabled={parseFloat(paymentAmount) > remainingDueAmount}
                >
                  Submit Payment
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseBillPaymentModal}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Billing Summary */}
          <div className="mt-6 bg-green-200 p-4 rounded">
            <h3 className="font-semibold text-gray-800">Billing Summary</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="text-gray-700">
                <p>Total Room Charges (incl. GST: {category.gst}%):</p>
                <p>Billed Amount:</p>
                <p>Cumulative Paid Amount:</p>
                <p>Due Amount:</p>
              </div>
              <div className="text-gray-800 font-semibold text-right">
                <p>
                  {(
                    parseFloat(category.total) *
                    ((new Date(booking.checkOut) - new Date(booking.checkIn)) /
                      (1000 * 3600 * 24))
                  ).toFixed(2)}
                </p>

                <p>{parseFloat(billing.totalAmount).toFixed(2)}</p>

                <p>{parseFloat(billing.amountAdvanced).toFixed(2)}</p>

                <p>{parseFloat(billing.dueAmount).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Payments and Room Tokens */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 text-center ml-16">
              Payments ({billing.DateOfPayment.length})
            </h3>
            <table className="w-full mt-2 bg-gray-100 rounded text-sm mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-center">Mode of Payment</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Rows for each payment in the arrays */}
                {billing.DateOfPayment.map((date, index) => (
                  <tr key={index}>
                    <td className="p-2 text-left">
                      {new Date(date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-2 text-center">
                      {billing.ModeOfPayment[index]}
                    </td>
                    <td className="p-2 text-right">
                      {parseFloat(billing.AmountOfPayment[index]).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Button
              variant="contained"
              color="warning"
              className="mt-6 mb-4"
              disabled={remainingDueAmount > 0 || billing.Bill_Paid === "yes"}
              onClick={handleCompletePayment}
            >
              Complete Payment
            </Button>

            <h3 className="mt-4 font-semibold text-gray-800 text-center ml-16">
              Room Tokens (1)
            </h3>
            <table className="w-full mt-2 bg-gray-100 rounded text-sm mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-center">Room Details</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-left">
                    {new Date(booking.checkIn).toLocaleDateString('en-GB')}
                  </td>
                  <td className="p-2 text-center">
                    Room #{billing.roomNo} - {room.category.category}
                  </td>
                  <td className="p-2 text-right">
                    {category.total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <Button
              variant="contained"
              color="info"
              className="mt-4 mb-4"
              onClick={handleOpenRoomInvoiceModal}
            >
              Print Room Invoice
            </Button>
            {/* Room Invoice Modal - pass isPaymentComplete */}
            <Modal
              open={openRoomInvoiceModal}
              onClose={handleCloseRoomInvoiceModal}
              aria-labelledby="room-invoice-modal"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "900px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <PrintableRoomInvoice
                  bookingDetails={{ ...bookingData, services: services }}
                />
              </Box>
            </Modal>
            {/* Services Table */}
            <h3 className="font-semibold text-gray-800 text-center ml-16">
              Services ({serviceItems.length})
            </h3>
            <table className="w-full mt-2 bg-gray-100 rounded text-sm mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Item Quantity</th>
                  <th className="p-2 text-center">Item Tax</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {serviceItems.map((service, index) => (
                  <tr key={index}>
                    <td className="p-2 text-left">{service.name}</td>
                    <td className="p-2 text-center">{service.quantity}</td>
                    <td className="p-2 text-center">{service.tax}%</td>
                    <td className="p-2 text-right">
                      {service.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Add Services Modal */}
            <Modal
              open={openServicesModal}
              onClose={handleCloseServicesModal}
              aria-labelledby="add-services-modal"
            >
              <Box sx={modalStyle}>
                <Typography id="add-services-modal" variant="h6" component="h2">
                  Add Service
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Service Details"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Service Price"
                  type="number"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Service Tax (%)"
                  type="number"
                  value={serviceTax}
                  onChange={(e) => setServiceTax(e.target.value)}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  readOnly
                  disabled
                  label="Total Amount"
                  type="number"
                  value={serviceTotal}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddService}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCloseServicesModal}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* Add Food Modal */}
            <Modal open={openFoodModal} onClose={handleCloseFoodModal} aria-labelledby="add-food-modal">
              <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 600,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4
              }}>
                <Typography id="add-food-modal" variant="h6" component="h2">
                  Add Food Items
                </Typography>

                {/* Food Selection Form */}
                <div className="mb-4">
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Food Item</InputLabel>
                    <Select
                      value={foodName}
                      label="Food Item"
                      onChange={handleFoodItemChange}
                    >
                      {menuItems.map((item) => (
                        <MenuItem key={item._id} value={item.itemName}>
                          {item.itemName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    margin="normal"
                    readOnly
                    disabled
                    label="Food Price"
                    value={foodPrice}
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    readOnly
                    disabled
                    label="Food Tax (%)"
                    value={foodTax}
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    type="number"
                    label="Quantity"
                    value={foodQuantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1 }}
                  />

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddToList}
                    disabled={!selectedFoodItem}
                    sx={{ mt: 2 }}
                  >
                    Add to List
                  </Button>
                </div>

                {/* Selected Items Table */}
                {selectedFoodItems.length > 0 && (
                  <div className="mt-4">
                    <Typography className="text-center" variant="h6">Selected Items</Typography>
                    <table className="w-full mt-2">
                      <thead>
                        <tr>
                          <th className="text-left">Item Name</th>
                          <th className="text-center">Price</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-center">Total</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFoodItems.map((item, index) => (
                          <tr key={index}>
                            <td className="text-left">{item.itemName}</td>
                            <td className="text-center">₹{item.price}</td>
                            <td className="text-center">
                              <div>
                                <Button
                                  size="small"
                                  onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <span className="text-center mx-2">{item.quantity}</span>
                                <Button
                                  size="small"
                                  onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td className="text-center">₹{item.totalPrice}</td>
                            <td className="text-right">
                              <Button
                                color="error"
                                size="small"
                                onClick={() => handleRemoveItem(index)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddFood}
                    disabled={selectedFoodItems.length === 0}
                  >
                    Submit All Items
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCloseFoodModal}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>
            <Button
              variant="contained"
              color="info"
              className="mt-4 mb-4"
              onClick={handleOpenServiceInvoiceModal}
            >
              Print Service Invoice
            </Button>
            {/* Food Items Table */}
            <h3 className="font-semibold text-gray-800 text-center ml-16">
              Food Items ({foodItems.length})
            </h3>
            <table className="w-full mt-2 bg-gray-100 rounded text-sm mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Item Quantity</th>
                  <th className="p-2 text-center">Item Tax</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {foodItems.map((food, index) => (
                  <tr key={index}>
                    <td className="p-2 text-left">{food.name}</td>
                    <td className="p-2 text-center">{food.quantity}</td>
                    <td className="p-2 text-center">{food.tax}%</td>
                    <td className="p-2 text-right">
                      {food.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Button
              variant="contained"
              color="info"
              className="mt-4 mb-4"
              onClick={handleOpenFoodInvoiceModal}
            >
              Print Food Invoice
            </Button>
            {/* Food Invoice Modal */}
            <Modal
              open={openFoodInvoiceModal}
              onClose={handleCloseFoodInvoiceModal}
              aria-labelledby="food-invoice-modal"
            >
              <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: "900px",
                maxHeight: "90vh",
                overflowY: "auto",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}>
                <PrintableFoodInvoice
                  bookingDetails={{
                    ...bookingData,
                    foodItems: foodItems
                  }}
                />
              </Box>
            </Modal>

            {/* Similar modification for Service Invoice Modal */}
            <Modal
              open={openServiceInvoiceModal}
              onClose={handleCloseServiceInvoiceModal}
              aria-labelledby="service-invoice-modal"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "900px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <PrintableServiceInvoice
                  bookingDetails={{ ...bookingData, services: services }}
                />
              </Box>
            </Modal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDashboard;