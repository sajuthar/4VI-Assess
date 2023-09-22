import './App.css';
import { useEffect, useState } from 'react';
import axios from "axios"
import Formtable from './components/Formtable';
// import { firestore } from 'firebase-firestore';
import { app, firestore } from './firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore'; 


axios.defaults.baseURL = "http://localhost:8080/";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function App() {
  const [addSection,setAddSection] = useState(false)
  const [editSection,setEditSection] = useState(false)
  const [formData,setFormData] = useState({
    name : "",
    nic :"",
    rentaldate : "",
    returndate :"",
    mobile : "", 
    email : "",
    driverneeded : "",
  })
  const [formDataEdit,setFormDataEdit] = useState({
    name : "",
    nic :"",
    rentaldate : "",
    returndate :"",
    mobile : "", 
    email : "",
    driverneeded : "",
    _id : ""
  })

  const errorMessages = {
    email: "Invalid email address",
    mobile: "Invalid mobile Number",
    nic: "Invalid NIC Number",
    // returndate:"Invalid Return date"
    
  };

  const [dataList,setDataList] = useState([])

  const handleOnChange = (e)=>{
    const {value,name} = e.target
    setFormData((preve)=>{
        return{
          ...preve,
          [name] : value
        }
    })
  }


  const [formErrors, setFormErrors] = useState({});



  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      nic: formData.nic,
      rentaldate: formData.rentaldate,
      returndate: formData.returndate,
      driverneeded: formData.driverneeded,
    };
  
      const response = await axios.post("http://localhost:8080/create", formData);
      // console.log(response.data);

      try {
        // Add the new product to the "products" collection in Firebase Firestore
        const docRef = await addDoc(collection(firestore, 'products'), newProduct);
    
        // Display a success message
        console.log('Document written with fire Doc ID: ', docRef.id);
    
        // Clear the form and fetch the updated data
        setAddSection(false);
        alert('Product added firebase successfully');
        getFetchData(); // Refresh the data from Firestore
        setFormData({
          name: "",
          nic: "",
          rentaldate: "",
          returndate: "",
          mobile: "",
          email: "",
          driverneeded: "",
        });
    } catch (error) {
      // console.log(error.response.data.errors)
      if (error.response && error.response.data && error.response.data.errors) {
        const formErrors = error.response.data.errors.reduce((acc, error) => {
          acc[error.path] = errorMessages[error.path] || error.msg;
          // console.log(acc);
          return acc;
        }, {});
        setFormErrors(formErrors);
      }
      console.error("Error submitting form:",error)
    }
  };
  // console.log(formErrors)
      
  
  const getFetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), _id: doc.id }));
      setDataList(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  
  useEffect(()=>{
    getFetchData()
  },[])

  const handleDelete = async(id)=>{
    const data = await axios.delete("/delete/"+id)
    
      if(data.data.success){
        getFetchData()
        alert(data.data.message)
      }
  }

  const handleUpdate = async(e)=>{
    e.preventDefault()
    const data = await axios.put("/update",formDataEdit)
    if(data.data.success){
      getFetchData()
      alert(data.data.message)
      setEditSection(false)
    }
  }
  const handleEditOnChange = async(e)=>{
    const {value,name} = e.target
    setFormDataEdit((preve)=>{
        return{
          ...preve,
          [name] : value
        }
    })
  }
  const handleEdit = (el)=>{
    setFormDataEdit(el)
    setEditSection(true)
  }
  return (
   <>
      <div className="container">
        <button className="btn btn-add" onClick={()=>setAddSection(true)}>Add</button>

      {
        addSection && (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleclose = {()=>setAddSection(false)}
            rest={formData}
            validations={formErrors}
          />
        )
      }
      {
        editSection && (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleclose = {()=>setEditSection(false)}
            rest={formDataEdit}
            validations={formErrors}

          />
        )
      }


      <div className='tableContainer'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>NIC</th>
              <th>Rental date</th>
              <th>Return date</th>
              <th>Driver Needed</th>
              <th>Activity</th>
              
            </tr>
          </thead>
          <tbody>
            { dataList[0] ? (
              dataList.map((el)=>{
                // console.log(el)
                return(
                  <tr key={el._id}>
                    <td>{el.name}</td>
                    <td>{el.email}</td>
                    <td>{el.mobile}</td>
                    <td>{el.nic}</td>
                    <td>{formatDate(el.rentaldate)}</td> 
                      <td>{formatDate(el.returndate)}</td> 
                      <td>{el.driverneeded}</td>
                    <td>
                      <button className='btn btn-edit' onClick={()=>handleEdit(el)}>Edit</button>
                      <button className='btn btn-delete' onClick={()=>handleDelete(el._id)}>Delete</button>
                    </td>
                  </tr>
                )
              }))
              : (
                <p style={{textAlign : "center"}}>No data</p>
              )
            }
          </tbody>
        </table>
      </div>
     


      </div>
   </>
  );
}

export default App;
