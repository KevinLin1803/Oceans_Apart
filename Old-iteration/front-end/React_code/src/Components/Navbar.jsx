import React from 'react'

const Navbar = () => {
	const date = Date().substring(0,15)

  return (
    <div>
        <div>
            My Day
        </div>
				<div>
					{date}
				</div>
      
    </div>
  )
}

export default Navbar
