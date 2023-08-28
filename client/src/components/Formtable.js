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
              <label htmlFor="name">Name : </label>
              <input type="text" id="name" name="name" onChange={handleOnChange} value={rest.name}/>


              <label htmlFor="email">Email : </label>
              <input type="email" id="email" name="email" onChange={handleOnChange} value={rest.email}/>
              {validations.email && <span className="error" style={{ color: "red" }}>{validations.email}</span>}<br></br>
              

              <label htmlFor="mobile">Mobile : </label>
              <input type="number" id="mobile" name="mobile" onChange={handleOnChange} value={rest.mobile}/>
              {validations.mobile && <span className="error" style={{color:"red"}} >{validations.mobile}</span>}<br></br>

              <label htmlFor="nic">NIC : </label>
              <input type="number" id="nic" name="nic" onChange={handleOnChange} value={rest.nic}/>
              {validations.nic && <span className="error" style={{color:"red"}} >{validations.nic}</span>}<br></br>


              <label htmlFor='rentaldate'>Rentaldate :</label>
              <input type="date" id="rentaldate" name="rentaldate" onChange={handleOnChange} value={rest.rentaldate} />

              <label htmlFor='returndate'>Returndate :</label>
              <input type="date" id="returndate" name="returndate" onChange={handleOnChange} value={rest.returndate}/>

              <label htmlFor='driverneeded'>Driver Needed? :</label>
              <select id="driverneeded" name="driverneeded" onChange={handleOnChange} value={rest.driverneeded} style={{height:"40px"}}>
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