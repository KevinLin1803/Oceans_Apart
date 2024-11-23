import React from 'react'
import Prevsession from './Prevsession'
import { useCookies } from 'react-cookie'
import { useState, useEffect } from 'react'
import search from './icons/search-interface-symbol.png'

const Session = () => {
	const [error, setError] = useState("")
	const [cookies, setCookies, removeCookies] = useCookies("")
	const [id, setId] = useState("")
	const [prevSessions, setPrevSessions] = useState(null)

	const getPrevSessions = async () => {
		try {
			const res = await fetch(`${process.env.REACT_APP_SERVER}/user/${cookies.Email}`)
			const data = await res.json()
			setPrevSessions(data[0].sessions)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(()=> getPrevSessions, [])

	const createSession = async (e) => {
		e.preventDefault()
		try {
			const res = await fetch(`${process.env.REACT_APP_SERVER}/createsession/${cookies.Email}`, {
				method: "POST",
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				}  
			})

			const data = await res.json()

			if (data.details) {
				setError(data.details)
			} else {
				console.log("error is here?", data.session)
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
			const res = await fetch(`${process.env.REACT_APP_SERVER}/joinsession/${id}/${cookies.Email}`)

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

	console.log(prevSessions)

  return (
    <div className='session-page'>
        <form className = 'create-session-container' onSubmit={createSession}>
            <button className='create-session-button'>Create Session</button>
        </form>
		<div className = 'join-session-container'>
			<form className = "join-session-form" onSubmit={joinSession}>
				<input type="text" className = "join-session-input" placeholder='Join Session' onChange={updateId}></input>
				<button className = "join-session-submit">
					<img className="session-search" src={search}></img>
				</button>
			</form>

			<div className = "previous-session-container">
				{prevSessions?.map((s) => <Prevsession key={s} session = {s}> </Prevsession>)}
			</div>
		</div>


		<div>{error}</div>
    </div>
  )
}

export default Session
