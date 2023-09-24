import './App.css';
import { useEffect, useState } from 'react';
import axios from "axios"
import Formtable from './components/Formtable';
// import { firestore } from 'firebase-firestore';
import { app, firestore } from './firebase';
import { addDoc, collection, getDocs ,deleteDoc,updateDoc,doc} from 'firebase/firestore';


axios.defaults.baseURL = "http://localhost:8080/";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function App() {
  const [addSection, setAddSection] = useState(false)
  const [editSection, setEditSection] = useState(false)
  const [formData, setFormData] = useState({
    pname: "",
    price: "",
    mnfDate: "",
    expDate: "",
    mobile: "",
    product_name: "",
    stockAvailable: "",
  })
  const [formDataEdit, setFormDataEdit] = useState({
    pname: "",
    price: "",
    mnfDate: "",
    expDate: "",
    mobile: "",
    product_name: "",
    stockAvailable: "",
    _id: ""
  })

  const errorMessages = {
    product_name: "product_name is not empty",
    mobile: "Not empty",
    price: "Invalid price",
    // exp.date:"Invalid Return date"

  };

  const [dataList, setDataList] = useState([])

  const handleOnChange = (e) => {
    const { value, name } = e.target
    setFormData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }


  const [formErrors, setFormErrors] = useState({});



  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      pname: formData.pname,
      product_name: formData.product_name,
      mobile: formData.mobile,
      price: formData.price,
      mnfDate: formData.mnfDate,
      expDate: formData.expDate,
      stockAvailable: formData.stockAvailable,
    };
    console.log(newProduct);


    const response = await axios.post("/create", formData);
    console.log(response.data);

    try {
      // Add the new product to the "products" collection in Firebase Firestore
      const docRef = await addDoc(collection(firestore, 'products'), newProduct);

      console.log('Document written with fire Doc ID: ', docRef.id);

      setAddSection(false);
      alert('Product added firebase successfully');
      getFetchData();
      setFormData({
        pname: "",
        price: "",
        mnfDate: "",
        expDate: "",
        mobile: "",
        product_name: "",
        stockAvailable: "",
      });
    } catch (error) {
      console.log(error.response.data.errors)
      if (error.response && error.response.data && error.response.data.errors) {
        const formErrors = error.response.data.errors.reduce((acc, error) => {
          acc[error.path] = errorMessages[error.path] || error.msg;
          // console.log(acc);
          return acc;
        }, {});
        // setFormErrors(formErrors);
      }
      console.error("Error submitting form:", error)
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

  useEffect(() => {
    getFetchData()
  }, [])
  const handleDelete = async (id) => {
    try {
      // Delete the document from the "products" collection in Firebase Firestore
      await deleteDoc(doc(firestore, 'products', id));
      alert('Product deleted from Firebase successfully');
      getFetchData();
    } catch (error) {
      console.error("Firebase Firestore DELETE error:", error);
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const { _id, ...rest } = formDataEdit;
  
      // Update the document in the "products" collection in Firebase Firestore
      await updateDoc(doc(firestore, 'products', _id), rest);
  
      alert('Product updated in Firebase successfully');
      getFetchData();
      setEditSection(false);
    } catch (error) {
      console.error("Firebase Firestore UPDATE error:", error);
    }
  };
  const handleEditOnChange = async (e) => {
    const { value, name } = e.target
    setFormDataEdit((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }
  const handleEdit = (el) => {
    setFormDataEdit(el)
    setEditSection(true)
  }
  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>

        {
          addSection && (
            <Formtable
              handleSubmit={handleSubmit}
              handleOnChange={handleOnChange}
              handleclose={() => setAddSection(false)}
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
              handleclose={() => setEditSection(false)}
              rest={formDataEdit}
              validations={formErrors}

            />
          )
        }


        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product_Name</th>
                <th>Weight(g)</th>
                <th>Price(LKR)</th>
                <th>Mnf.Date</th>
                <th>Exp.Date</th>
                <th>Stock</th>
                <th>Activity</th>

              </tr>
            </thead>
            <tbody>
              {dataList[0] ? (
                dataList.map((el) => {
                  // console.log(el)
                  return (
                    <tr key={el._id}>
                      <td>{el.pname}</td>
                      <td>{el.product_name}</td>
                      <td>{el.mobile}</td>
                      <td>{el.price}</td>
                      <td>{formatDate(el.mnfDate)}</td>
                      <td>{formatDate(el.expDate)}</td>
                      <td>{el.stockAvailable}</td>
                      <td>
                        <button className='btn btn-edit' onClick={() => handleEdit(el)}>Edit</button>
                        <button className='btn btn-delete' onClick={() => handleDelete(el._id)}>Delete</button>
                      </td>
                    </tr>
                  )
                }))
                : (
                  <p style={{ textAlign: "center" }}>No data</p>
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

