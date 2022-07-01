const collegeModel = require("../models/college.model");
const internModel = require("../models/intern.model");

const linkRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#()?&//=]*)/gim;

const isValid = function (value) {
  if (typeof value === "undefined" || value === "null") return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidrequestBody = function (data) {
  return Object.keys(data).length > 0;
};

//=============================================**Post Api : To create college data**=============================================================//
let collegeData = async (req, res) => {
  try {
    let data = req.body;

    //validations starts
    if (!isValidrequestBody(data)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide college details",
      });
    }

    if (!isValid(data.name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }
    if (!/^[a-z]+$/i.test(data.name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name should be in valid format" });
    }
    const isName = await collegeModel.findOne({ name: data.name });

    if (isName) {
      return res
        .status(400)
        .send({ status: false, message: "College name already registered" });
    }
    if (!isValid(data.fullName)) {
      return res
        .status(400)
        .send({ status: false, message: "fullName is required" });
    }
    if (!/[a-zA-Z\s]+$/.test(data.fullName)) {
      return res
        .status(400)
        .send({ status: false, message: "fullName should be in valid format" });
    }

    if (!isValid(data.logoLink)) {
      return res
        .status(400)
        .send({ status: false, message: "logolink is required" });
    }

    if (!data.logoLink.match(linkRegex)) {
      return res
        .status(400)
        .send({ status: "false", msg: "use valid Logolink" });
    }

    //validations ends

    let result = await collegeModel.create(data);
    res.status(201).send({ status: true, data: { result } });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//================================================**Post Api : To create intern data**===========================================================//
let internData = async (req, res) => {
  try {
    const { name, email, mobile, collegeName } = req.body;

    //validations starts
    if (!isValidrequestBody(req.body)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide intern details",
      });
    }

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }
    if (!/^[a-z,',-]+(\s)[a-z,',-]+$/i.test(name)) {
      res
        .status(400)
        .send({ status: false, message: "Name should be in valid format" });
      return;
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }

    if (!/^[a-z0-9]{1,}@g(oogle)?mail\.com$/.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email should be in valid format" });
    }

    const emailUsed = await internModel.findOne({ email: email });
    if (emailUsed) {
      return res
        .status(400)
        .send({ status: false, message: "Email is already registered" });
    }

    if (!isValid(mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "Number is required" });
    }
    if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(mobile)) {
      return res.status(400).send({
        status: false,
        message: "Mobile number should be in valid format",
      });
    }

    const isMobile = await internModel.findOne({ mobile: mobile });

    if (isMobile) {
      res
        .status(400)
        .send({ status: false, message: "Mobile number already registered" });
      return;
    }

    if (!collegeName) {
      res
        .status(400)
        .send({ status: false, message: "collegeName is required" });
      return;
    }

    const doc = await collegeModel.findOne({ name: collegeName });
    if (!doc) {
      res
        .status(400)
        .send({ status: false, message: "collegeName is not registered" });
      return;
    }

    //validation ends
    let collegeId = doc._id;
    const result = await internModel.create({ name, email, mobile, collegeId });
    res.status(201).send({ status: true, data: { result } });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//=====================================================**Get Api : To get data of interns**======================================================//

let collegeDetails = async (req, res) => {
  try {
    let query = req.query.collegeName;

    //validation starts
    if (!isValid(query)) {
      return res.status(400).send({
        status: false,
        message:
          "Invalid request parameters. Please provide Collegname details",
      });
    }
    if (!query.match(/^[a-z]+$/)) {
      return res
        .status(400)
        .send({ status: false, message: "Name should be in valid format" });
    }
    let specificCollege = await collegeModel.findOne({ name: query });
    if (!specificCollege) {
      return res
        .status(400)
        .send({ status: true, message: "No college exists with that name" });
    }

    let id = specificCollege._id.toString();
    let intern = await internModel.find({ collegeId: id, isDeleted: false }).select({_id:1,name:1,email:1,mobile:1});

    if (!isValidrequestBody(intern)) {
      return res
        .status(400)
        .send({ status: false, message: "no intern is regestered" });
    }

    //validations ends
    let data = {
      //new object
      name: specificCollege.name,
      fullName: specificCollege.fullName,
      logoLink: specificCollege.logoLink,
      interns: intern, //array in intern
    };
    return res.status(200).send({ status: true, data: { data } });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports = { collegeData, internData, collegeDetails };
