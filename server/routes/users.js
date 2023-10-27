const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {sendOTP,verifyEmail,signIn,getCurrentUser, sendFeedback, setProfilePic, sendSubcription, sendResetEmail, resetPassword, resendOTP} = require('../controllers/users')

/*Router indicates the mapping of url string with corresponding handler(controller) function*/

/* This route is designed in order to handle requests around user
getting an already authenticated user when website loads, 
while registration, send an otp, resend an otp, verify a email through otp,
signinig in a user, a user submitting feedback,
setting profile pic of a user, a user subscribing to get notifications,
send email to reset password and resetting password when user forgots password*/
router.get('',auth,getCurrentUser)
router.post('/sendOTP',sendOTP)
router.post('/resendOTP',resendOTP)
router.post('/verifyEmail',verifyEmail)
router.post('/signIn',signIn)
router.post('/feedback',sendFeedback)
router.post('/profilePic',auth,setProfilePic)
router.post('/notifications/subscribe',auth,sendSubcription)
router.post('/resetEmail',sendResetEmail)
router.post('/resetPassword',resetPassword)

module.exports = router