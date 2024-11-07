import React from 'react'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

const Auth = () => {
	const [cookies, setCookies, removeCookies] = useCookies("")
	const [signup, setSignup] = useState(true)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [inputType, setInputType] = useState('password')
	const [error, setError] = useState('')

	const handleEmailChange = (e) => {
		setEmail(e.target.value)
	}

	const handlePasswordChange = (e) => {
		setPassword(e.target.value)
	}

	const handleConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value)
	}

	const showPassword = () => {
		if (inputType === 'password') {
			setInputType('text')
		} else {
			setInputType('password')
		}
	}
	
	const postUser = async (e) => {
		e.preventDefault()
		const url = signup? `${process.env.REACT_APP_SERVER}/signup` : `${process.env.REACT_APP_SERVER}/login`

		if (signup && (password !== confirmPassword)) {
			setError('Passwords do not match')
			return
		}

		try {
			// Also wanna set up/make sure passwords match
			const res = await fetch(url,  {
				method: "POST",
				body: JSON.stringify({email: email, password: password}),
				headers: {
					 "Content-type": "application/json; charset=UTF-8"
				}
			})
			
			const data = await res.json()

			if (data.details) {
				setError(data.details)
			} else {
				setCookies('Email', data.email)
				setCookies('AuthToken', data.token)	
				window.location.reload();
			}
		} catch (err) {
			console.log(err)
		}
	}


  return (
    <form className = "auth-page" onSubmit={postUser}>
		<div className = "auth-page-title"> {signup? 'Sign Up' : 'Log In'} </div>
		<div className = "auth-page-input-container">
			<input type="email" placeholder="Email" className = "auth-page-inputs" onChange={handleEmailChange}></input>
			<input type={inputType} placeholder="Password" className = "auth-page-inputs" onChange={handlePasswordChange}></input>
			{signup && <input type={inputType} placeholder="Confirm Password" className = "auth-page-inputs" onChange={handleConfirmPasswordChange}></input>}
			<div className = "show-password-button" onClick={showPassword}> Show Password</div>
			<div>{error}</div>
			<button> Submit </button>
			<div className = "auth-buttons">
				<button type = "button" className = "auth-button" onClick={() => setSignup(true)}> Sign up </button>
				<button type = "button" className = "auth-button" onClick={() => {setSignup(false)}}> Log in </button>
			</div>
		</div>

    </form>
  )
}

export default Auth
