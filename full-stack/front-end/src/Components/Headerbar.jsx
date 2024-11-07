import React from 'react'
import menu from './icons/menu.png'
import grid from './icons/list.png'
import signout from './icons/logout.png'
import { useCookies } from 'react-cookie'



const Headerbar = () => {
  const [cookies, setCookies, removeCookies] = useCookies("")

    // I need to delete session from the database as well ngl
  const logout = () => {
    removeCookies('Email')
    removeCookies('AuthToken')
    removeCookies('Session')
    window.location.reload();
  }

  return (
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

            <div className="invite-link"></div>

            <div className = "sign-out" onClick={logout} >
                <img src={signout} alt='signout'></img>
            </div>

        </div>

        <div className = "date"> {Date().substring(0,15)} </div>
    </nav>
    )
}

export default Headerbar
