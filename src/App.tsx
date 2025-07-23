import { useState } from 'react'
import Dndmain from './dnd-demo/DndMain'
import GameMain from './components/game/GameMain'
import DeckInfo from './components/deck-info/DeckInfo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Example_App /> */}
      <Dndmain />
      {/* <GameMain /> */}
      {/* <DeckInfo /> */}
    </>
  )
}

export default App
