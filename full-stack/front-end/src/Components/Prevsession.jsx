import React from 'react'
import { useCookies } from 'react-cookie'
import { useState, useEffect } from 'react'

const Prevsession = ({session}) => {
	const [error, setError] = useState("")
    const [cookies, setCookies, removeCookies] = useCookies("")

    const joinSession = async (e) => {
		e.preventDefault()

		try {
			const res = await fetch(`${process.env.REACT_APP_SERVER}/joinsession/${session}/${null}`)

			const data = await res.json()

			if (data.details) {
				setError(data.details)
			} else {
				setCookies('Session', session)
				window.location.reload();
			}
		} catch (err) {
			console.error(err)
		}
	}

    console.log(session)

  return (
    <div className = "previous-sessions" onClick={joinSession} >
        {session}
    </div>
  )
}

export default Prevsession
