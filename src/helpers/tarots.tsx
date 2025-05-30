//A collection of tarots

//https://balatrogame.fandom.com/wiki/Tarot_Cards

import { Tarot } from "../types/misc";


const loversTarot: Tarot = {
  name: 'lovers',
  price: 3,
  sellValue: 1,
  description: 'enhances 1 selected card into wildcard',
}

type AllTarotFunctions = {
  [key: string]: Function,
}
export const allTarotFunctions: AllTarotFunctions = {

}

type Tarots = {
  [index: string]: Tarot,
}
export const allTarots:Tarots = {
  loversTarot,
}

export const allTarotsList = Object.values(allTarots);
