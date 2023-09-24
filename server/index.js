const express  = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');

const corsOptions = {
  origin: 'http://localhost:3000', 
};

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

const PORT  = process.env.PORT || 8080


//schema
const schemaData  = mongoose.Schema({
    pName : String,
    product_name : String,
    mobile : Number,
    rentaldate : Date,
    returndate : Date,
    nic : Number,
    driverneeded : String,
},{
    timestamps : true
})

const userModel  = mongoose.model("user",schemaData)

// read
// ​ http://localhost:8080/

app.get("/",async(req,res)=>{
    const data = await userModel.find({})
    res.json({success : true , data : data})
})  



//http://localhost:8080/create


app.post("/create" ,async (req, res) => {
  // const errors = validationResult(req);
    
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ success: false, errors: errors.array() });
    //   console.log(errors);
    // }
    //  console.log(req.body);
    // .
    try {
      // Convert string dates to Date objects
      const rentalDateObj = new Date(req.body.rentaldate);
      const returnDateObj = new Date(req.body.returndate);
  
      // Check if returndate is greater than or equal to rentaldate
      if (returnDateObj < rentalDateObj) {
        return res.status(400).json({
          success: false,
          message: "Return date must be greater than or equal to rental date.",
        });
      }


   
      // Create a new userModel document
      const data = new userModel({
        rentaldate: rentalDateObj,
        returndate: returnDateObj,
        ...req.body, 
      });

      await data.save();
      res.json({ success: true, message: "data saved successfully", data: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "An error occurred", error: error.message });
      console.log(error)
    }
  }
);


//update data 
// http://localhost:8080/update


app.put("/update/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const { ...rest } = req.body;
    console.log(id);
    const data = await userModel.findByIdAndUpdate(id, rest, { new: true });
    if (!data) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }
    return res.status(200).json({ success: true, message: "Data updated successfully", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
});


//delete api
// http://localhost:8080/delete/id
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if the ID is a valid ObjectId
   
    const data = await userModel.deleteOne({ _id: id });


    return res.status(200).json({ success: true, message: "Data deleted successfully", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
});



mongoose.connect("mongodb://127.0.0.1:27017/crudoperation")
.then(()=>{
    console.log("connect to DB")
    app.listen(PORT,()=>console.log("Server is running"))
})
.catch((err)=>console.log(' local db not connect',err))

