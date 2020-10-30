import React, { useRef, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha"


const App = () => {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    time: '',
    date: ''
  })

  const { name, phone, email, time, date } = formData

  const reRef = useRef()

  const onChange = e => {setFormData({...formData, [e.target.name]: e.target.value})} 

  const onSubmit = async e => {
    e.preventDefault()
    const token = await reRef.current.executeAsync()
    console.log(token)
    const {data} = await axios.post('/calendar', { name, phone, email, time, date, token} )  
    console.log(data)
    if(data.msg==='Event created!'){
      toast.success(data.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    }
    if(data.msg==='Something went wrong!'){
      toast.error(data.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    }
    setFormData({...formData, name: '', phone: '', email: '', time: '', date: ''})
    reRef.current.reset()
  }

  
  return (
    <>
      <h1 className='title'>Form-calendar</h1>
      <div className='form'>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} placeholder='name' value={name} name='name' type="text" required /> <br/>
        <small>Format: 000-000-0000</small> <br/>
        <input onChange={onChange} placeholder='phone' value={phone} name='phone' type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required /> <br/>
        <input onChange={onChange} placeholder='email' value={email} name='email' type="email" required /> <br/>
        <input onChange={onChange} placeholder='time' value={time} name='time' type="time" required /> <br/>
        <input onChange={onChange} placeholder='date' value={date} name='date' type="date" required /> <br/>
        <button>Submit</button>
      </form>
      </div>
      <ReCAPTCHA sitekey='6LddId0ZAAAAAA3g0F_PLdI9Rind0efk5GWPrcej' size='invisible' ref={reRef} />
      <ToastContainer />
    </> 
  )
}

export default App 
