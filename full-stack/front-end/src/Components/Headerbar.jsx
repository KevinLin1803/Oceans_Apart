import React from 'react'
import menu from './icons/menu.png'
import grid from './icons/list.png'


const Headerbar = () => {
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

            <div className="session-code"></div>
            <div className="invite link"></div>
        </div>

        <div className = "date"> {Date().substring(0,15)} </div>
    </nav>
    )
}

export default Headerbar
