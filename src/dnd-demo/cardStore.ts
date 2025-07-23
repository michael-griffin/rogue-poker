import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
//import { devtools } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import { buildSimpleDeck, buildStartDeck, selectCards } from "../helpers/cards/cards";

import { type Card } from "../types/misc"




const defaultSimpleDeck = buildSimpleDeck();
const defaultHand = defaultSimpleDeck.slice(0,8);
const defaultCardOrder = Array(defaultHand.length).fill(-1).map((_, ind) => ind);
const defaultSelectedCards = Array(defaultHand.length).fill(false);

type CardActions = {
  addFive: () => void,
  dealCards: () => void,
  swapOrder: (a:number, b:number) => void,
  toggleSelected: (ind:number) => void,
}
type CardStore = {
  deck: Card[],
  dealtCards: Card[],
  cardOrder: number[],
  selectedCards: boolean[],
  money: number,
  actions: CardActions,
}

export const useSimpleCardStore = create<CardStore>()(immer((set) => ({
  deck: defaultSimpleDeck,
  dealtCards: defaultHand,
  cardOrder: defaultCardOrder,
  selectedCards: defaultSelectedCards,
  money: 15,
  actions: {
    addFive: () => {
      set(state => ({...state, money: state.money + 5}))
    },
    dealCards: () => {
      const newHand = defaultSimpleDeck.slice(8,11);
      set(state => {
        return {
          ...state,
          dealtCards: newHand,
        }
      })
    },
    swapOrder: (a, b) => {
      set(state => {
        let oldOrder = state.cardOrder;
        let newOrder = arrayMove(oldOrder, a, b);
        return {
          ...state,
          cardOrder: newOrder,
        }
      })
    },
    toggleSelected: (ind) => {
      set(state => {
        let newSelectedCards = state.selectedCards;
        newSelectedCards[ind] = !newSelectedCards[ind];
        return {
          ...state,
          selectCards: newSelectedCards,
        }
      })
    }
  }
})))

export const useCardOrder = () => useSimpleCardStore(state => state.cardOrder);
export const useDealtCards = () => useSimpleCardStore(state => state.dealtCards);
export const useSelectedCards = () => useSimpleCardStore(state => state.selectedCards);
export const useCardActions = () => useSimpleCardStore(state => state.actions);