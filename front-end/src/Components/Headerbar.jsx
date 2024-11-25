import React from 'react'
import signout from './icons/logout.png'
import Modal from './Modal'
import { useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import heart from './icons/heart.png'


const Headerbar = () => {
  const [cookies, setCookies, removeCookies] = useCookies("")
  const [showModal, setShowModal] = useState(false)
  const [dates, setDates] = useState([])

    // I need to delete session from the database as well ngl
  const logout = () => {
    removeCookies('Email')
    removeCookies('AuthToken')
    removeCookies('Session')
    window.location.reload();
  }

  const getDates = (async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER}/dates/${cookies.Session}`)
      const data = await res.json()
      setDates(data)
      console.log(data)
      if (data.length == 0) {
        setShowModal(true)
      }
    } catch(err) {
      console.error(err)
    }
  })

  useEffect(()=> {getDates()}, [])

  return (
    <>
      <nav className = "header-bar">
          <div className = "tools-container">
              <div className = "title">{`Session ID: ${cookies.Session}`} </div>

              {/* Let's have a look at how overlays work */}
              <button onClick={()=>setShowModal(true)} className = "date-button">
                <label htmlFor='date-button-icon'> Date List</label>
                <img src={heart} className ="date-button-icon"></img>
              </button>

              <div className="invite-link"></div>

              <div className = "sign-out" onClick={logout} >
                  <img src={signout} alt='signout'></img>
              </div>

          </div>

          <div className = "date"> {Date().substring(0,15)} </div>
      </nav>
      
      {showModal && < Modal setShowModal={setShowModal}/>}
    </>
    )
}

// Mindset switch a little bit?? --> integrate google log in. I think that was a good conversation

// The balance between being an AI engineer and a proper software engineer/becoming a developer

// Therefore as a software engineer/apsiring one --> should you just plug everything into AI?

export default Headerbar
