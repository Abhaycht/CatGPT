import { useState, useEffect } from 'react'

import './App.css'

const App = () => {
const [value, setValue] = useState(null)
const [message, setMessage] = useState(null)
const [previousChats, setpreviousChats] = useState([])
const [currentTitle, setCurrentTitle] = useState(null)

const createNewChat = () => {
  setMessage(null)
  setValue("")
  setCurrentTitle(null)

}

const handleClick = (uniqueTitle) => {
  setCurrentTitle(uniqueTitle)
  setMessage(null)
  setValue("")
}

const getMessagges = async () => {
 
  const options = {
    method: "POST",
    body: JSON.stringify({
      message: value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
 

  try{
    const response = await fetch('http://localhost:8000/completions', options)
    const data = await response.json()
    setMessage(data.choices[0].message)
  } catch(error) {
    console.error(error)
  }
}

useEffect(() => {
  
  if(!currentTitle && value && message){
    setCurrentTitle(value)
  }
  if(currentTitle && value && message){
    setpreviousChats(prevChats => (
      [...prevChats, {
          title: currentTitle,
          role: "user",
          content: value
        }, 
        {
          title: currentTitle,
          role: message.role,
          content: message.content

        }
      ]
    ))
  }
}, [message, currentTitle])

console.log(previousChats)

const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
console.log(uniqueTitles)



return (
  <div className='app'>
    <section className='side-bar'>
      <button onClick={createNewChat}>+ New Chat</button>
      <ul className='history'>
        {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>) }
      </ul>
      <nav>
        <p><a href="https://abhay-portfolio.webflow.io/">Made by Abhay</a></p>
      </nav>
    </section>
    <section className="main">
      {!currentTitle && <h1>CatGPT</h1> }
      <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
       
    
      </ul>
      <div className='bottom-section'>
        <div className='input-container'>
          <input value={value} onChange={(e) => setValue(e.target.value)}  />
          <div id='submit' onClick={getMessagges}>➢</div>
        </div>
        <p className='info'>
        fun fact: Cats have a flexible spine and can rotate their ears 180 degrees, which helps them locate the source of a sound without having to move their entire head.
        </p>
      </div>
    </section>
  </div> 
    
)
 
} 

export default App
