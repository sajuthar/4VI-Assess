const express  = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');


const app = express()
app.use(cors())
app.use(express.json())

const PORT  = process.env.PORT || 8000

function validateMobile(mobile) {
    const mobileRegex =  /^([+]\d{2})?\d{10}$/;
        return mobileRegex.test(mobile);
  }

function validateNic(nic) {
    const nicRegex =  /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        return nicRegex.test(nic);
  }

//schema
const schemaData  = mongoose.Schema({
    name : String,
    email : String,
    mobile : String,
    rentaldate : Date,
    returndate : Date,
    nic : Number,
    driverneeded : String,
},{
    timestamps : true
})

const userModel  = mongoose.model("user",schemaData)

// read
// ​ http://localhost:8000/
app.get("/",async(req,res)=>{
    const data = await userModel.find({})
    res.json({success : true , data : data})
})  


//create data || save data in mongodb
//http://localhost:8000/create


app.post(
  "/create",
  [
    body("email")
    .trim()
    .isEmail()
    .notEmpty()
    .withMessage("Invalid email address !"),
  body("name").notEmpty().withMessage("Name can not be empy"),

    body("mobile").notEmpty().custom(validateMobile).withMessage("Invalid mobile Number!"),
    
    body("nic").notEmpty().custom(validateNic).withMessage("Invalid NIC Number!"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    //  console.log(req.body);
    const { year, month, date } = req.body;
    const rentaldate = new Date(year, month - 1, date);
    const returndate = new Date(year, month - 1, date);

    try {
      // Create a new userModel document
      const data = new userModel({
        rentaldate: rentaldate,
        returndate: returndate,
        ...req.body, 
      });

      await data.save();
      res.json({ success: true, message: "data saved successfully", data: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
  }
);


//update data 
// http://localhost:8000/update


app.put("/update",[
    body("email").trim()
      .isEmail()
      .notEmpty()
      .withMessage("Invalid email address"),
    body("mobile").notEmpty()
        .withMessage("Invalid mobile Number"),
    body("name").notEmpty().withMessage("Name is required must"),
    body("nic").notEmpty().withMessage("Invalid NIC Number"),
    body("returndate")  // Add custom validation for returndate
        .custom((value, { req }) => {
            const rentaldate = new Date(req.body.rentaldate);
            const returndate = new Date(value);
            if (returndate <= rentaldate) {
                throw new Error("Return date must be greater than rental date");
            }
            return true;
        }),
    
],async(req,res)=>{
    const { _id,...rest} = req.body 
    const data = await userModel.findByIdAndUpdate({ _id : _id},rest)
    res.send({success : true, message : "data update successfully", data : data})
})

//delete api
// http://localhost:8000/delete/id
app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id : id})
    res.send({success : true, message : "data delete successfully", data : data})
})



mongoose.connect("mongodb://127.0.0.1:27017/crudoperation")
.then(()=>{
    console.log("connect to DB")
    app.listen(PORT,()=>console.log("Server is running"))
})
.catch((err)=>console.log(err))

