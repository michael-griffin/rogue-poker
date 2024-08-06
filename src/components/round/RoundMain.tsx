import JokerList from "../joker-list/JokerList";
import {Joker as JokerType} from "../../types/misc-types"

function RoundMain(){
  const defaultCards = [
    {id: 1, rank: 2, suit: 'clubs'},
    {id: 2, rank: 3, suit: 'clubs'},
    {id: 3, rank: 4, suit: 'clubs'},
    {id: 4, rank: 5, suit: 'clubs'},
    {id: 5, rank: 6, suit: 'clubs'},
  ];

  const defaultJokers: JokerType[] = [
    {name: 'Mystic_Summit', special: null, negative: false, price: 5, sellValue: 2},
    {name: 'Banner', special: null, negative: false, price: 5, sellValue: 2},
  ];

  return (
    <>
      <JokerList jokers={defaultJokers} />
    </>
  )
}


export default RoundMain;