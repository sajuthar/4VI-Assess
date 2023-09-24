import React,{useState} from 'react';
import "../App.css";
import { MdClose } from 'react-icons/md';
import "../App"

const Formtable = ({handleSubmit,handleOnChange,handleclose,rest,validations}) => {
  function formatDateForInput(dateString) {
    const [year, month, day] = dateString.split('-'); 
    return `${year}-${month}-${day}`; 
  }
  // console.log(validations);

  return (
    <div className="addContainer">
            <form onSubmit={handleSubmit}>
            <div className="close-btn" onClick={handleclose}><MdClose/></div>
              <label htmlFor="pname">Image : </label>
              <input type="text" id="pname" name="pname" onChange={handleOnChange} value={rest.pname}/>


              <label htmlFor="product_name">Product_Name: </label>
              <input type="text" id="product_name" name="product_name" onChange={handleOnChange} value={rest.product_name}/>
              {/* {validations.email && <span className="error" style={{ color: "red" }}>{validations.email}</span>}<br></br> */}
              

              <label htmlFor="mobile">Weight(g) : </label>
              <input type="number" id="mobile" name="mobile" onChange={handleOnChange} value={rest.mobile}/>
              {/* {validations.mobile && <span className="error" style={{color:"red"}} >{validations.mobile}</span>}<br></br> */}

              <label htmlFor="price">Price(LKR) : </label>
              <input type="number" id="price" name="price" onChange={handleOnChange} value={rest.price}/>
              {/* {validations.nic && <span className="error" style={{color:"red"}} >{validations.nic}</span>}<br></br> */}


              <label htmlFor='mnfDate'>Mnf.Date :</label>
              <input type="date" id="mnfDate" name="mnfDate" onChange={handleOnChange} value={rest.mnfDate} />

              <label htmlFor='expDate'>Exp.Date :</label>
              <input type="date" id="expDate" name="expDate" onChange={handleOnChange} value={rest.expDate}/>
              {/* {validations.returndate && <span className="error" style={{color:"red"}} >{validations.returndate}</span>}<br></br> */}


              <label htmlFor='stockAvailable'>Stock Avilable? :</label>
              <select id="stockAvailable" name="stockAvailable" onChange={handleOnChange} value={rest.stockAvailable} style={{height:"40px"}}>
                <option value= "select">Choose One </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <br></br>

              <button className="btn">Submit</button>
            </form>
    </div>
  )
}

export default Formtable