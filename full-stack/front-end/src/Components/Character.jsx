import React from 'react'

const Character = () => {
  return (
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
            <circle cx="250" cy="150" r="100" fill="skyblue" />
            <rect x="150" y="200" width="200" height="100" fill="orange" />
            <text x="250" y="350" font-family="Arial" font-size="36" text-anchor="middle" fill="darkslategray">SVG Example</text>
        </svg>
    </div>
  )
}

export default Character
