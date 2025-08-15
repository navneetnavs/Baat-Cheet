import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import AIAssistant from '../components/AIAssistant'

const Home = () => {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat/>
        {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
        
        <button
          onClick={() => setShowAI(!showAI)}
          className={`ai-toggle ${showAI ? 'active' : ''}`}
        >
          {showAI ? '✕' : '🤖'}
        </button>
      </div>
    </div>
  )
}

export default Home