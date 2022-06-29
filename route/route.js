const express = require('express');
const controller = require('../controllers/controllers')
const router = express.Router();

//api for creation of colleges
router.route("/functionup/colleges").post(controller.collegeData)

//api for creation of interns 

router.route("/functionup/interns").post(controller.internData)


//api for fetching all interns data with particular collegeId

router.route("/functionup/collegeDetails").get(controller.collegeDetails)





module.exports = router;