import React from 'react'
import { useCookies } from 'react-cookie'
import { useState } from 'react'

const Session = () => {
	const [error, setError] = useState("")
	const [cookies, setCookies, removeCookies] = useCookies("")
	const [id, setId] = useState("")

	const createSession = async (e) => {
		e.preventDefault()
		try {
			const res = await fetch(`${process.env.REACT_APP_SERVER}/createsession`, {
				method: "POST",
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}  
			})

			const data = await res.json()

			console.log(data)

			if (data.details) {
				setError(data.details)
			} else {
				setCookies('Session', data.session)
				window.location.reload();
			}

		} catch (err) {
			console.error(err)
		}
	}

	const joinSession = async (e) => {
		e.preventDefault()

		try {
			const res = await fetch(`${process.env.REACT_APP_SERVER}/joinsession/${id}`)

			const data = await res.json()

			if (data.details) {
				setError(data.details)
			} else {
				setCookies('Session', id)
				window.location.reload();
			}

		} catch (err) {
			console.error(err)
		}
	}

	const updateId = async (e) => {
		setId(e.target.value)
		console.log(id)
	}

  return (
    <div className='session-page'>
        <form className = 'create-session-container' onSubmit={createSession}>
            <button className='create-session-button'>Create Session</button>
        </form>
        <form className = "join-session-container" onSubmit={joinSession}>
            <div className='join-session-title'> Join session </div>
            <input type="text" className = "join-session-input" onChange={updateId}></input>
            <button className = "join-session-submit">Submit</button>
        </form>

		<div>{error}</div>
    </div>
  )
}

export default Session
