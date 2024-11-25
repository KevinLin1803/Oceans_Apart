import React from 'react'
import heart from './icons/heart.png'
import trash from './icons/trash-can.png'
import { useCookies } from 'react-cookie'
import { useState, useEffect } from 'react'

const Date = ({date, prize, showRandomDate}) => {
  const [cookies, setCookies, removeCookies] = useCookies("")
  const [randomDate, setRandomDate] = useState(null);
  const [deleteRandom, setDeleteRandom] = useState(false)

  const deleteDate = async() => {
    if (!prize || deleteRandom) {
      try {
        await fetch(`${process.env.REACT_APP_SERVER}/dates/${date.date_id}`, {
          method: "DELETE",
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  // Question in react --> when do we use functions and when do we use variable functions?
  const getRandomDate = async () => {
    fetch(`${process.env.REACT_APP_SERVER}/dates/${cookies.Session}`)
      .then((res) => res.json())
      .then((data) => {
        setRandomDate(data[getRandomInt(data.length)])
      })
      .catch((err) => {
        console.error('Error fetching dates:', err);
      });
  }

  useEffect(() => getRandomDate, []);

  const bookDate = () => {
    const eventTitle = encodeURIComponent(randomDate.date_title)
    const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${eventTitle}`
    window.open(calendarUrl, '_blank')
  }

  if (prize) {
    if (!randomDate) return <div>Please Input Another Date</div>;
  
    return (
        <div className = 'modal' style={{'height': '200px', 'width': '500px'}}>
          <div className = 'random-date-container'>
            <img src={heart} className="checkmark-icon" alt="complete"></img>
            <div id={randomDate.date_id}>{randomDate.date_title}</div>
            <img src={heart} className="checkmark-icon" alt="complete"></img>
          </div>

          <button onClick={bookDate} className="book-date">
            Book Now &#128523;
          </button>
        </div>
    )

  } else {

    return (
      <div className='task-container-single'>
        <div className = "checkbox"> 
          <img src={heart} className="checkmark-icon" alt="complete"></img>
        </div>
  
        <div className = "task" id={date.date_id}></div>
        <label htmlFor = {date.date_id}> {date.date_title} </label>
        <button className = "delete-task-button" onClick={deleteDate}> 
          <img src={trash} className="trash-icon" alt="delete"></img>
        </button>
    </div>
    )

  }
}

export default Date
