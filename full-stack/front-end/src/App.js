import Headerbar from "./Components/Headerbar"
import TaskGrid from "./Components/TaskGrid"
import Auth from "./Components/Auth"
import Progressbar from "./Components/Progressbar"
import Session from "./Components/Session"
import Character from "./Components/Character"
import Background from "./Components/Background"
import { useCookies } from 'react-cookie'


function App() {
	const [cookies, setCookies, removeCookies] = useCookies("")

  var authToken = cookies.AuthToken
  var sessionToken = cookies.Session
  var email = cookies.Email

  return (
    <>
      {/* <Character /> */}

      <Background />

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