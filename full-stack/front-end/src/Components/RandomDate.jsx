import React, { useState } from 'react'
import Date from './Date'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'


const RandomDate = () => {
  const [cookies, setCookies, removeCookies] = useCookies("")
	const [randomDate, setRandomDate] = useState(null)

	function getRandomInt(max) {
			return Math.floor(Math.random() * max);
	}

	const getDates = async() => {
		try {
      const res = await fetch(`${process.env.REACT_APP_SERVER}/dates/${cookies.Session}`)
      const data = await res.json()
      setRandomDate(data[getRandomInt(data.length)])
    } catch(err) {
      console.error(err)
    }
	}

	useEffect(() => getDates, [])
    
  return (
    <div>
			<Date date={randomDate} prize={true}></Date>
    </div>
  )
}

export default RandomDate
