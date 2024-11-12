import React from 'react'
import menu from './icons/menu.png'
import grid from './icons/list.png'
import signout from './icons/logout.png'
import Modal from './Modal'
import { useState } from 'react'
import { useCookies } from 'react-cookie'


const Headerbar = () => {
  const [cookies, setCookies, removeCookies] = useCookies("")
  const [showModal, setShowModal] = useState(false)

    // I need to delete session from the database as well ngl
  const logout = () => {
    removeCookies('Email')
    removeCookies('AuthToken')
    removeCookies('Session')
    window.location.reload();
  }

  return (
    <>
      <nav className = "header-bar">
          <div className = "tools-container">
              <div className = "title"> Our Day </div>
              <div className = "icon"> 
                  <img src={menu} alt='menu'></img>
                  <div> Grid</div>
              </div>
              <div className = "icon">
                  <img src={grid} alt='grid'></img>
                  <div> List </div>
              </div>

              <div className="session-code">{`Session Id: ${cookies.Session}`}</div>

              {/* onclick for this I want to show off a modal and then be able to add + delete date ideas 
              (hot damn --> a mini to do list in of itself) --> this would involve more web sockets though. I wonder if. no you don't want that
              HMMM --> storing it would be good
              Otherwise generating a date idea would be interesting as well (AI date idea --> creating this wrapper would cost me money though) */}

              {/* Let's have a look at how overlays work */}
              <button onClick={()=>setShowModal(true)}>Date List</button>

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
