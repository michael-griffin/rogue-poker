import { useState } from 'react'
import './App.css'
import DnDmain from './dnd-demo/DnDmain'
import GameMain from './components/Game/GameMain'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <DnDmain /> */}
      <GameMain />
    </>
  )
}

export default App
