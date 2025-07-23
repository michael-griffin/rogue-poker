import "./Card.css";
import { RankNum, Card as TCard } from "../../types/misc";
import { rankNames } from "../../helpers/constants";


type CardComponent = TCard & {
  id: number,
  selected: boolean
}
type ToggleSelectedFn = (id: number) => void;
type CardComponentProps = {
  card: CardComponent,
  toggleSelected: ToggleSelectedFn
}

function Card({card, toggleSelected}: CardComponentProps){
  const {id, selected, rank, suit, cardType, enhanced, special, seal} = card;
  const rankName = rankNames[rank as RankNum]

  const imgSrc = `/cards/${rankName}-${suit}.png`;
  function handleClick(){
    toggleSelected(id);
    console.log('clicked card');
  }
  const selectedClass = selected ? 'selected' : '';

  return (
    <div>
      <img className={`card ${selectedClass}`} src={imgSrc} onClick={handleClick}/>
    </div>
  )
}

export default Card;