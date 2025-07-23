import "./Card.css";
import { RankNum, Card as TCard } from "../types/misc";
import { rankNames } from "../helpers/constants";
import { useSelectedCards, useCardActions } from "./cardStore";


type ToggleSelectedFn = (id: number) => void;
type CardComponentProps = {
  card: TCard,
  id: number,
  canSelect: boolean,

}

function Card({ card, id, canSelect }: CardComponentProps){
  const {rank, suit, cardType, enhanced, special, seal} = card;
  const rankName = rankNames[rank as RankNum];
  const imgSrc = `/cards/${rankName}-${suit}.png`;

  const { toggleSelected } = useCardActions();
  let selected = false;
  let handleClick;

  if (canSelect){ //must be in round
    selected = useSelectedCards()[id];
    handleClick = () => {
      toggleSelected(id);
      console.log('clicked card');
    }
  }
  // function handleClick(){
  //   toggleSelected(id);
  //   console.log('clicked card');
  // }
  const selectedClass = selected ? 'selected' : '';

  return (
    <div>
      <img className={`card ${selectedClass}`} src={imgSrc} onClick={handleClick}/>
    </div>
  )
}

export default Card;