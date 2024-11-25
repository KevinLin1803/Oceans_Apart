import React from 'react'
import Date from './Date'
import heart from './icons/heart.png'

import { useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import { getSocket } from './socket';


const Modal = ({setShowModal}) => {
  const [dateTitle, setDateTitle] = useState('')
  const [dates, setDates] = useState([])
  const [cookies, setCookies, removeCookies] = useCookies("")

  // When to create something as a component? I think I probs could've created a component here for inputs
  const addDate = ( (e) => {
    e.preventDefault();
    postDate()
    setDateTitle('')
  })

  const postDate = (async () => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER}/dates`, {
        method: "POST",
        body: JSON.stringify({
          "id": null,
          "session_id": cookies.Session,
          "title": dateTitle,
          "date": null
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }  
      })

    } catch (err) {
      console.error(err)
    }
  })


  const getDates = (async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER}/dates/${cookies.Session}`)
      const data = await res.json()
      setDates(data)
    } catch(err) {
      console.error(err)
    }
  })

  useEffect(() => {
    console.log('modal sockets are being initalised XX times')
    const socket = getSocket()

    // initialising callbacks -> callbacks = a function that calls another. It's used to manage asynchroncity in this place
    // eg: to ensure that "if event happens, callback function is called". Otherwise wihtou the callback, the function will run
    // regardless of the event
    const handleDates = () => {getDates()}
    const handleDisconnect =  () => { console.log('Disconnected from server') }


    // In other words: we need the callback for the function to behave as intended/in the order we want
    socket.on('date_update', handleDates)
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('date_update', handleDates)
      socket.off('disconnect', handleDisconnect);
    };  
  }, [])

  useEffect(()=> {getDates()}, [])
  
  return (
    <div className='overlay'>
        <div className = 'modal'>
            <div className = "modal-header">
              <form className = "input-bar-date-form" onSubmit={addDate}>
                <input className = "input-bar-date" type="text" placeholder="Add Your Steamy Date" value={dateTitle} onChange={(e)=> {setDateTitle(e.target.value)}}></input>
              </form>
              {/* Callbacks and useMemo are areas you're still unfamiliar with */}
              <button onClick={()=>{setShowModal(false)}}>X</button>
            </div>

            <div className = "objective-description"> * Reach 100% to decide your next date! </div>

            <div className = "date-container">
              <div className = "title"> Your Dates </div>
              {dates?.map((date) => <Date key={date.date_id} date={date} prize={false}/>)}
            </div>

        </div>      
    </div>
  )
}

export default Modal


  // const retrieveRandomDate = async () => { 
        
  //   setShowModal(true); 
  //   console.log('schno', dates, dates.length)

  //   // It's calling multiple times and it's empty

  //   if (dates.length > 0) {
  //     let random = getRandomInt(dates.length)
  //     let selectedDate = dates[random]
  //     setRandomDate(selectedDate.date_title)
  //     console.log('RANDOM DATE',randomDate, selectedDate.date_title)

  //     try {
  //       await fetch(`${process.env.REACT_APP_SERVER}/dates/${selectedDate.date_id}`, {
  //         method: "DELETE",
  //       })
  //     } catch (err) {
  //       console.error(err)
  //     }  

  //   } else {
  //     console.error('Date list is empty')
  //   }
  // }

