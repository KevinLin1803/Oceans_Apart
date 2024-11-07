import Headerbar from "./Components/Headerbar"
import TaskGrid from "./Components/TaskGrid"
import Auth from "./Components/Auth"
import Progressbar from "./Components/Progressbar"
import Session from "./Components/Session"
import { useCookies } from 'react-cookie'


function App() {
	const [cookies, setCookies, removeCookies] = useCookies("")

  var authToken = cookies.AuthToken
  var sessionToken = cookies.Session

  console.log(authToken)

  console.log(sessionToken)

  // I think I'll want to do something similar here with a session token

  // can pass email into your other components to show that you only get the stuff from the userEmail specified
  // ask chatGpt for design help?
  var email = cookies.Email

  return (
    <>
      {!authToken && <Auth />}

      {authToken && !sessionToken && <Session />}

      {authToken && sessionToken &&
      <> 
        <Headerbar /> 
        <TaskGrid /> 
        <Progressbar />
      </> }
    </>
  )
}

export default App