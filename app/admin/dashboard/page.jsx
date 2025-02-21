"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  Stack,
  Tooltip,
  MenuItem,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Add,
  CheckCircle,
  Cancel,
  ErrorOutline,
  CheckCircleOutline,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../../_components/admin-navbar";
import { getCookie } from 'cookies-next';
import { Footer } from "../../_components/Footer";
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Define states and districts (same as in Profile.js and ProfilePage.jsx)
const indianStatesAndUTs = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const stateDistricts = {
  "Andhra Pradesh": [
    "Anakapalli", "Anantapur", "Annamayya", "Alluri Sitharama Raju", "Bapatla",
    "Chittoor", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna",
    "Kurnool", "Nandyal", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam",
    "Vizianagaram", "West Godavari"
  ],
  "Arunachal Pradesh": [
    "Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey",
    "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang",
    "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley",
    "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo",
    "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara",
    "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan",
    "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur",
    "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar",
    "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  "Bihar": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
    "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj",
    "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj",
    "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda",
    "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran",
    "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali",
    "West Champaran"
  ],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur",
    "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi",
    "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba",
    "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur",
    "Rajnandgaon", "Sukma", "Surajpur", "Surguja"
  ],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch",
    "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka",
    "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch",
    "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
    "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar",
    "Tapi", "Vadodara", "Valsad"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram",
    "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh",
    "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa",
    "Sonipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti",
    "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Jharkhand": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
    "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti",
    "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
    "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Urban", "Bengaluru Rural",
    "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
    "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
    "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura",
    "Yadgir"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
    "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
    "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani",
    "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara",
    "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda",
    "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone",
    "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna",
    "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni",
    "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli",
    "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
    "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
    "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani",
    "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur",
    "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West",
    "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl",
    "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
    "Ri-Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
    "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai",
    "Lunglei", "Mamit", "Saitual", "Siaha", "Serchhip"
  ],
  "Nagaland": [
    "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Noklak",
    "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"
  ],
  "Odisha": [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack",
    "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur",
    "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha",
    "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada",
    "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka",
    "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana",
    "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur",
    "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara",
    "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur",
    "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu",
    "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand",
    "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
  ],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari",
    "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal",
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet",
    "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi",
    "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur",
    "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial",
    "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
    "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
    "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"
  ],
  "Tripura": [
    "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura",
    "Unakoti", "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha",
    "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia",
    "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi",
    "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria",
    "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
    "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi",
    "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat",
    "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri",
    "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura",
    "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit",
    "Pratapgarh", "Prayagraj", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal",
    "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar",
    "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar",
    "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal",
    "Udham Singh Nagar", "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong",
    "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas",
    "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur",
    "Purulia", "South 24 Parganas", "Uttar Dinajpur"
  ],
  "Andaman and Nicobar Islands": [
    "Nicobar", "North and Middle Andaman", "South Andaman"
  ],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli", "Daman", "Diu"
  ],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
    "North West Delhi", "Shahdara", "South Delhi", "South East Delhi",
    "South West Delhi", "West Delhi"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal",
    "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama",
    "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"
  ],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "16px",
    padding: theme.spacing(4),
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
  },
}));

const SuperAdminDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [openAddProfileDialog, setOpenAddProfileDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openIssueDialog, setOpenIssueDialog] = useState(false);
  const [issueProfile, setIssueProfile] = useState(null);
  const [formData, setFormData] = useState({
    hotelName: "",
    mobileNo: "",
    email: "",
    username: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    altMobile: "",
    state: "",
    district: "",
    gstNo: "",
    pinCode: "",
    website: "",
    Profile_Complete: "no",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const token = getCookie('adminauthToken');
        console.log(token);
        if (!token) {
          router.push('/admin/login');
          return;
        }
        const response = await fetch("/api/Profile");
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setProfiles(data.data);
        } else {
          toast.error("Failed to fetch profiles.");
        }
      } catch (error) {
        toast.error("Error fetching profiles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedProfileId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/Profile/${selectedProfileId}`);
      if (response.data.success) {
        setProfiles(
          profiles.filter((profile) => profile._id !== selectedProfileId)
        );
        setOpenDeleteDialog(false);
        toast.success("Profile deleted successfully!");
      } else {
        toast.error("Failed to delete profile.");
      }
    } catch (error) {
      toast.error("Error deleting profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProfileId(null);
  };

  const handleOpenAddProfileDialog = () => {
    setIsEditing(false);
    setFormData({
      hotelName: "",
      mobileNo: "",
      email: "",
      username: "",
      password: "",
      addressLine1: "",
      addressLine2: "",
      altMobile: "",
      state: "",
      district: "",
      gstNo: "",
      pinCode: "",
      website: "",
      Profile_Complete: "no",
    });
    setErrors({});
    setOpenAddProfileDialog(true);
  };

  const toggleActiveStatus = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/Profile/${id}`);
      console.log(response);
      if (response.status === 200) {
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile._id === id ? response.data.data : profile
          )
        );
        toast.success("Active status toggled successfully!");
      } else {
        toast.error("Failed to toggle active status: " + response.data.error);
      }
    } catch (error) {
      toast.error("Error toggling active status: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAddProfileDialog = () => {
    setOpenAddProfileDialog(false);
    setFormData({
      hotelName: "",
      mobileNo: "",
      email: "",
      username: "",
      password: "",
      addressLine1: "",
      addressLine2: "",
      altMobile: "",
      state: "",
      district: "",
      gstNo: "",
      pinCode: "",
      website: "",
      Profile_Complete: "no",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // Reset district if state changes and the current district isn't valid for the new state
      ...(name === 'state' && prevData.district && !stateDistricts[value]?.includes(prevData.district) ? { district: "" } : {})
    }));
    console.log(formData);

    // Validate fields on change
    let newErrors = { ...errors };
    if (name === "username") {
      if (value.length < 3 || value.length > 20) {
        newErrors.username = "Username must be between 3 and 20 characters.";
      } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
        newErrors.username = "Username must be alphanumeric.";
      } else {
        delete newErrors.username;
      }
    }
    if (name === "password" && !isEditing) {
      const passwordErrors = validatePassword(value);
      if (Object.keys(passwordErrors).length > 0) {
        newErrors.password = Object.values(passwordErrors).join(" ");
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
  };

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
      errors.minLength = "Password must be at least 8 characters long.";
    }
    if (password.length > 13) {
      errors.maxLength = "Password must be no more than 13 characters long.";
    }
    return errors;
  };

  const handleAddProfile = async () => {
    // Validate form before submission
    let newErrors = {};
    if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = "Username must be between 3 and 20 characters.";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = "Username must be alphanumeric.";
    }
    if (
      !isEditing &&
      (formData.password.length < 8 || formData.password.length > 13)
    ) {
      newErrors.password = "Password must be between 8 and 13 characters.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the form errors !!");
      return;
    }
    try {
      setIsLoading(true);
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/Profile/${selectedProfileId}`
        : "/api/Profile";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        if (isEditing) {
          setProfiles((prevProfiles) =>
            prevProfiles.map((profile) =>
              profile._id === selectedProfileId ? data.data : profile
            )
          );
        } else {
          setProfiles([...profiles, data.data]);
        }
        setOpenAddProfileDialog(false);
        setFormData({
          hotelName: "",
          mobileNo: "",
          email: "",
          username: "",
          password: "",
          addressLine1: "",
          addressLine2: "",
          altMobile: "",
          state: "",
          district: "",
          gstNo: "",
          pinCode: "",
          website: "",
          Profile_Complete: "no",
        });
        setErrors({});
        toast.success("Profile added successfully!");
      } else {
        toast.error("Username already exists !!");
      }
    } catch (error) {
      toast.error("Error adding profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditProfileDialog = (profile) => {
    setIsEditing(true);
    setFormData({
      hotelName: profile.hotelName,
      mobileNo: profile.mobileNo,
      email: profile.email,
      username: profile.username,
      password: "",
      addressLine1: profile.addressLine1 || "",
      addressLine2: profile.addressLine2 || "",
      altMobile: profile.altMobile || "",
      state: profile.state || "",
      district: profile.district || "",
      gstNo: profile.gstNo || "",
      pinCode: profile.pinCode || "",
      website: profile.website || "",
      Profile_Complete: profile.Profile_Complete || "no",
    });
    setErrors({});
    setOpenAddProfileDialog(true);
    setSelectedProfileId(profile._id);
  };

  const modalStyle = {
    width: 500, // Adjusted width
    height: 600, // Adjusted height
  };

  const handleOpenIssueDialog = (profile) => {
    setIssueProfile(profile);
    setOpenIssueDialog(true);
  };

  const handleCloseIssueDialog = () => {
    setOpenIssueDialog(false);
    setIssueProfile(null);
  };

  const handleResolveIssue = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(`/api/Profile/${issueProfile._id}`, {
        forgotUsername: false,
        forgotPassword: false,
      });
      console.log(response);
      if (response.data.success) {
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile._id === issueProfile._id
              ? { ...profile, forgotUsername: false, forgotPassword: false }
              : profile
          )
        );
        handleCloseIssueDialog();
        toast.success("Issue resolved successfully!");
      } else {
        toast.error("Failed to resolve issue.");
      }
    } catch (error) {
      toast.error("Error resolving issue.");
    } finally {
      setIsLoading(false);
    }
  };

  const getIssueIcon = (profile) => {
    if (profile.forgotUsername && profile.forgotPassword) {
      return (
        <Tooltip title="Forgot Username & Password">
          <ErrorOutline
            sx={{
              color: "red",
              animation: "pop 0.5s infinite alternate",
            }}
          />
        </Tooltip>
      );
    } else if (profile.forgotUsername) {
      return (
        <Tooltip title="Forgot Username">
          <ErrorOutline
            sx={{
              color: "orange",
              animation: "pop 0.5s infinite alternate",
            }}
          />
        </Tooltip>
      );
    } else if (profile.forgotPassword) {
      return (
        <Tooltip title="Forgot Password">
          <ErrorOutline
            sx={{
              color: "yellow",
              animation: "pop 0.5s infinite alternate",
            }}
          />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="No Issues">
          <CheckCircleOutline
            sx={{
              color: "green",
              animation: "pop 0.5s infinite alternate",
            }}
          />
        </Tooltip>
      );
    }
  };

  const deleteSpecificCookies = () => {
    document.cookie =
      "adminauthToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie =
      "adminclientToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    deleteSpecificCookies();
    setTimeout(() => {
      setIsLoggingOut(false);
      router.push("/admin/login");
    }, 800);
  };

  const getDistrictOptions = () => {
    return formData.state ? stateDistricts[formData.state] || [] : [];
  };

  return (
    <div>
      <Navbar />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="mt-4 text-gray-700">Loading Hotel List...</span>
          </div>
        </div>
      )}
      <div className="bg-amber-50 min-h-screen mt-6">
        <Container maxWidth="lg" style={{ marginTop: "0rem" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledCard>
                <CardHeader
                  title="Super Admin Dashboard"
                  className=" text-3xl text-center font-bold text-cyan-900"
                  subheader="Manage Hotel Admin Profiles"
                  action={
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenAddProfileDialog}
                    >
                      Add New Profile <Add className="ml-1" />
                    </Button>
                  }
                />
                <CardContent>
                  <TableContainer
                    component={Paper}
                    elevation={6}
                    style={{ borderRadius: "16px" }}
                  >
                    <Table aria-label="profiles table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Hotel Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Mobile No</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>User Issue</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profiles.map((profile) => (
                          <TableRow
                            key={profile._id}
                            style={{
                              backgroundColor: profile.Active === 'no' ? '#ffdddd' : '#f8f9fa',
                              transition: 'background-color 0.3s',
                            }}
                          >
                            <TableCell>{profile.hotelName}</TableCell>
                            <TableCell>{profile.email}</TableCell>
                            <TableCell>{profile.mobileNo}</TableCell>
                            <TableCell>{profile.username || "N/A"}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleOpenIssueDialog(profile)}
                              >
                                {getIssueIcon(profile)}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              {profile.Active === 'yes' ? (
                                <CheckCircle color="success" />
                              ) : (
                                <Cancel color="error" />
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleOpenEditProfileDialog(profile)
                                }
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                color="secondary"
                                onClick={() => handleDeleteClick(profile._id)}
                              >
                                <Delete />
                              </IconButton>
                              <IconButton
                                color="default"
                                onClick={() => toggleActiveStatus(profile._id)}
                              >
                                <Visibility />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Container>

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

        {/* Delete Confirmation Dialog */}
        <StyledDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Profile</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this profile?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </StyledDialog>

        {/* Add/Edit Profile Dialog */}
        <StyledDialog
          open={openAddProfileDialog}
          onClose={handleCloseAddProfileDialog}
        >
          <DialogTitle>
            {isEditing ? "Edit Profile" : "Add New Profile"}
          </DialogTitle>
          <DialogContent sx={modalStyle}>
            <Stack spacing={2} className="mt-2">
              <TextField
                label="Hotel Name"
                variant="outlined"
                fullWidth
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                required
              />
              <TextField
                label="Mobile No"
                variant="outlined"
                fullWidth
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
              <TextField
                label="Alt Mobile"
                variant="outlined"
                fullWidth
                name="altMobile"
                value={formData.altMobile}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                error={Boolean(errors.username)}
                helperText={errors.username}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <TextField
                label="Address Line 1"
                variant="outlined"
                fullWidth
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
              />
              <TextField
                label="Address Line 2"
                variant="outlined"
                fullWidth
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
              />
              <TextField
                select
                label="State"
                variant="outlined"
                fullWidth
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <MenuItem value="">Select State</MenuItem>
                {indianStatesAndUTs.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="District"
                variant="outlined"
                fullWidth
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.state}
              >
                <MenuItem value="">Select District</MenuItem>
                {getDistrictOptions().map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="GST No"
                variant="outlined"
                fullWidth
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
              />
              <TextField
                label="Pin Code"
                variant="outlined"
                fullWidth
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
              />
              <TextField
                label="Website"
                variant="outlined"
                fullWidth
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddProfileDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddProfile} color="secondary">
              {isEditing ? "Update Profile" : "Add Profile"}
            </Button>
          </DialogActions>
        </StyledDialog>

        {/* Issue Dialog */}
        <StyledDialog
          open={openIssueDialog}
          onClose={handleCloseIssueDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              backgroundColor: "#f9f9f9",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogTitle>
            {issueProfile?.forgotUsername && issueProfile?.forgotPassword
              ? "Forgot Username & Password"
              : issueProfile?.forgotUsername
              ? "Forgot Username"
              : issueProfile?.forgotPassword
              ? "Forgot Password"
              : "No Issues"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {issueProfile?.forgotUsername && issueProfile?.forgotPassword
                ? "This user has requested help with both their username and password."
                : issueProfile?.forgotUsername
                ? "This user has requested help with their username."
                : issueProfile?.forgotPassword
                ? "This user has requested help with their password."
                : "This user has no issues."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseIssueDialog} color="primary">
              Close
            </Button>
            {(issueProfile?.forgotUsername || issueProfile?.forgotPassword) && (
              <Button onClick={handleResolveIssue} color="secondary">
                Resolve
              </Button>
            )}
          </DialogActions>
        </StyledDialog>
      </div>
      <Footer />
      <style jsx global>{`
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminDashboard;