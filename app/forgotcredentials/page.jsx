"use client"
import React, { useState } from "react"
import { Footer } from "../_components/Footer"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button, Container, TextField, Modal, Box, Typography, Alert } from "@mui/material"
import { User, Lock, Mail, ArrowRight, X, CheckCircle } from "lucide-react"

const ForgottenCredentials = () => {
  const [openUsernameModal, setOpenUsernameModal] = useState(false)
  const [openPasswordModal, setOpenPasswordModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleOpenUsernameModal = () => {
    setOpenUsernameModal(true)
    setError("")
  }

  const handleCloseUsernameModal = () => {
    setOpenUsernameModal(false)
    setEmail("")
    setError("")
  }

  const handleOpenPasswordModal = () => {
    setOpenPasswordModal(true)
    setError("")
  }

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false)
    setUsername("")
    setError("")
  }

  const handleSubmitUsername = async () => {
    try {
      const response = await fetch('/api/forgot-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'username'
        })
      });

      const data = await response.json();

      if (data.success) {
        setOpenUsernameModal(false)
        setSuccessMessage("Your request for forgotten username has been registered. The Super admin will contact you shortly.")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        setError(data.error || "Email not found")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleSubmitPassword = async () => {
    try {
      const response = await fetch('/api/forgot-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          type: 'password'
        })
      });

      const data = await response.json();

      if (data.success) {
        setOpenPasswordModal(false)
        setSuccessMessage("Your request for forgotten password has been registered. The Super admin will contact you shortly.")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        setError(data.error || "Username not found")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  }

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <nav className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <Link href="/property/roomdashboard">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/Hotel-Logo.png"
                alt="BookingMaster.in"
                width={190}
                height={60}
                priority
                className="pr-4"
              />
            </div>
          </Link>
        </div>
      </nav>

      <Container maxWidth="sm" className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-8 p-8 bg-white rounded-lg shadow-xl"
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Forgot Credentials
          </Typography>

          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<User />}
                onClick={handleOpenUsernameModal}
              >
                Forgot Username
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                startIcon={<Lock />}
                onClick={handleOpenPasswordModal}
              >
                Forgot Password
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>

      <Footer />

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Alert
              icon={<CheckCircle className="text-green-500" />}
              severity="success"
              className="bg-white shadow-xl"
            >
              {successMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Username Modal */}
      <Modal open={openUsernameModal} onClose={handleCloseUsernameModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Forgot Username
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Registered Email ID"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <Mail className="mr-2 text-gray-400" size={20} />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<ArrowRight />}
            onClick={handleSubmitUsername}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            size="large"
            onClick={handleCloseUsernameModal}
            startIcon={<X />}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal open={openPasswordModal} onClose={handleClosePasswordModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Forgot Password
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Registered Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: <User className="mr-2 text-gray-400" size={20} />,
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
            startIcon={<ArrowRight />}
            onClick={handleSubmitPassword}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            size="large"
            onClick={handleClosePasswordModal}
            startIcon={<X />}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default ForgottenCredentials