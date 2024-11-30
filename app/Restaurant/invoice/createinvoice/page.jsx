"use client";
import React, { useState, useEffect } from "react";
 const CreateInvoicePage = ({ onInvoiceCreate, existingInvoice }) => {
  const [menu,setmenu] = useState([]);
  const [formData, setFormData] = useState({
    invoiceno: "",
    date: "",
    time: "",
    custname: "",
    itemName:"",
    quantity:"",
    price:"",

    totalamt: "",
    gst: "",
    payableamt: "",
  });

  useEffect( ()=>{
    const fetchmenu=async()=>{
      try{
        const menuresponse=await fetch("/api/menuItem");
        const menudata=await menuresponse.json();
        console.log(menudata.data);
        setmenu(menudata.data);
      }
      catch(error){
        console.error("failed to fetch data",error);
      }
    };
    fetchmenu();
  },
  
  []
  );

  useEffect(() => {
    if (existingInvoice) {
      setFormData({
        invoiceno: existingInvoice.invoiceno || "",
        date: existingInvoice.date
          ? new Date(existingInvoice.date).toISOString().split("T")[0]
          : "", // Format to YYYY-MM-DD
        time: existingInvoice.time || "",
        custname: existingInvoice.custname || "",
        totalamt: existingInvoice.totalamt || "",
        gst: existingInvoice.gst || "",
        payableamt: existingInvoice.payableamt || "",
      });
    }
  }, [existingInvoice]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = existingInvoice ? "PUT" : "POST";
      const url = existingInvoice
        ? `/api/restaurantinvoice/${existingInvoice._id}`
        : "/api/restaurantinvoice";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Invoice saved successfully:", data);
        if (onInvoiceCreate) onInvoiceCreate(data.data);
        setFormData({
          invoiceno: "",
          date: "",
          time: "",
          custname: "",
          totalamt: "",
          gst: "",
          payableamt: "",
        });
      } else {
        console.error("Error saving invoice:", data.error);
      }
    } catch (error) {
      console.error("Error during invoice save:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Create Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4 overflow-auto">
        {[
          { label: "Invoice No.", name: "invoiceno", type: "text" },
          { label: "Date", name: "date", type: "date" },
          { label: "Time", name: "time", type: "time" },
          { label: "Customer Name", name: "custname", type: "text" },
          {label:"select menu item", name:"menuitem", type:"text"},

          { label: "Total Amount", name: "totalamt", type: "number" },
          { label: "GST", name: "gst", type: "number" },
          { label: "Payable Amount", name: "payableamt", type: "number" },
        ].map(({ label, name, type }) => (
          <label key={name} className="block">
            {label}
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </label>
        ))}
        <select 
        label="select menu item"
        name="menuitem"
        type="text"
        className="text-black w-full px-3 py-2 border rounded-md"
        > <option value="">select item</option>
        {menu.map((item)=>(
          <option key={item._id} value={item.itemName}>
           {item.itemName}


          </option>
        ))}
        </select>
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => setFormData({})}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoicePage;
