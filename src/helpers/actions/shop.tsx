import {
  CardDeck,
  PlanetDeck,
  TarotDeck,
  BroadDeck,
  RunStatus,
  ShopStock,
  ShelfItem,
  Pack,
  VoucherTypes,
  Planet,
  Tarot,
  Joker,
  Card,

} from '../../types/misc';

//import {baseHandSize, rankNames, chipValues, shopInfo, allVouchers,
//  scoreGoals, baseScores, levelUps} from './constants';
import { allVouchers, baseHandSize, shopInfo } from "../constants";
import { chooseIndices, shuffle } from './misc';
import {
  addToDeck,
  getSelectedCards,
  selectCards,
  buildCardDeck,
  makeRandomCards,
  dealCards,
  resetDeck,
 } from '../cards/cards';
import { allPlanetsList, dealPlanets, usePlanet } from '../cards/planets'; //, dealPlanets, levelUpHand
import { allTarotsList, useTarot,  dealTarots } from '../cards/tarots'; //allTarotFunctions, dealTarots
import { allJokerFunctions, findActiveJokers,  // uncommonJokers
  commonJokersList, uncommonJokersList, rareJokersList } from "../cards/jokers";

//FIXME: Add this!
// function buyItem(stock, category:'shelf'|'voucher'|'pack', ind=0){

// }

/** Builds an empty Shop object holding a shelf, packs, and a voucher,
 * then stocks it.
 * TODO: Vouchers stocked should eventually be based off runStatus.
 * Inputs: RunStatus
 * Returns ShopStock
*/
/** Trickier than it seems. Vouchers can add card/tarot to the shelf */
export function stockShop(runStatus:RunStatus){
  const newStock = buildStock();
  //add shelf items
  newStock['shelf'] = restockShelf();

  //add voucher
  let possVouchers = structuredClone(allVouchers);
  let ownedVouchers = runStatus['vouchers'];
  possVouchers = possVouchers.filter(voucher => !ownedVouchers.includes(voucher));
  possVouchers = shuffle(possVouchers);
  newStock['vouchers'].push(possVouchers[0]);

  //add packs
  let possPacks = buildPackVariations();
  possPacks = shuffle(possPacks);
  newStock['packs'].push(possPacks[0]);
  newStock['packs'].push(possPacks[1]);

  return newStock;
}
// stock = {
//   'shelf': [{category: 'joker', item: jokerInst}, ...],
//   'voucher': [VoucherTypes],
//   'pack': [{packType: planet|tarot, size:]
// }
// type ShelfItem = {category: string, item:Joker|Card|Tarot|Planet};
function buildStock(): ShopStock {

  const shelf:ShelfItem[] = [];
  const vouchers:VoucherTypes[] = [];
  const packs:Pack[] = [];
  let newStock:ShopStock = {shelf, vouchers, packs};
  return newStock;
}

//TODO: currently missing special edition implementation.
function restockShelf(){
  let newShelf:ShelfItem[] = [];
  let possItems = [];
  let possRarities = [];
  const {shelfRates, jokerRates} = shopInfo;
  for (let [category, quantity] of Object.entries(shelfRates)){
    for (let i = 0; i < quantity; i++){
      possItems.push(category);
    }
  }
  for (let [rarity, quantity] of Object.entries(jokerRates)){
    for (let i = 0; i < quantity; i++){
      possRarities.push(rarity);
    }
  }

  possItems = shuffle(possItems);
  possRarities = shuffle(possRarities);

  let planets = shuffle(allPlanetsList);
  let tarots = shuffle(allTarotsList);
  let commonJokers = shuffle(commonJokersList);
  let uncommonJokers = shuffle(uncommonJokersList);
  let rareJokers = shuffle(rareJokersList);
  for (let i = 0; i < 2; i++){ //TODO: increase to 4 to handle overstock voucher.
    let category = possItems[i];
    let nextItem:Planet|Tarot|Joker|Card; //TODO: add card.

    if (category === 'planet'){
      nextItem = planets[i];
    } else if (category === 'tarot'){
      nextItem = tarots[i];
    } else { // if (category === 'joker'){
      let rarity = possRarities[i];
      if (rarity === 'common'){
        nextItem = commonJokers[i];
      } else if (rarity === 'uncommon'){
        nextItem = uncommonJokers[i];
      } else { //if (rarity === 'rare'){
        nextItem = rareJokers[i];
      }
      possRarities = shuffle(possRarities);
    }

    newShelf.push({category, item: nextItem});
  }


  return newShelf;
}
function buildPackVariations(){
  let packs:Pack[] = [];
  let packTypes = ['planet', 'tarot'];
  let sizes = ['normal', 'jumbo', 'mega'];
  let cardCounts = {'normal': 4, 'jumbo': 5, 'mega': 6};
  let versions = [1, 2];

  for (let packType of packTypes){
    for (let size of sizes){
      let cardCount = cardCounts[size as 'normal'|'jumbo'|'mega'];
      for (let version of versions){
        let newPack = {packType, size, cardCount, version} as Pack;
        packs.push(newPack);
      }
    }
  }

  return packs;
}


export function usePack(pack:Pack, baseDeck:CardDeck, baseRun:RunStatus,
  choiceType:('simple'|'random'|'manual')='simple'){

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let {packType, cardCount} = pack;
  let opened:BroadDeck = openPack(pack);
  //TODO: can make this fancy by allowing multiple choices
  //We could do the below multiple times, and adjust
  //opened to remove the already used card/tarot/planet

  let indices = chooseIndices(choiceType, 1, cardCount);
  opened = selectCards(opened, indices);
  let chosen = getSelectedCards(opened)[0];

  if (packType === 'card'){
    let card = chosen as Card;
    currentDeck = addToDeck(currentDeck, card);

  } else if (packType === 'planet'){
    let planet = chosen as Planet;
    currentRun = usePlanet(currentRun, planet);

  } else if (packType === 'tarot'){
    let tarot = chosen as Tarot;

    //Tarot Packs sometimes need an additional choice: cards
    let chooseCount = tarot['cardsUsed'][tarot.cardsUsed.length - 1]; //use max
    if (chooseCount > 0){
      console.log('for tarot packs, we also need a card selection');
      currentDeck = dealCards(currentDeck, baseHandSize);
      let inds = chooseIndices(choiceType, chooseCount, baseHandSize);
      currentDeck = selectCards(currentDeck, inds) as CardDeck;
    }

    let result = useTarot(currentDeck, currentRun, tarot);

    if (result['status'] !== 'invalid'){ //technically unnecessary, would be unchanged
      currentDeck = result['cardDeck'];
      currentRun = result['runStatus'];
    }
  }

  currentDeck = resetDeck(currentDeck); //clear any dealt cards from using a Tarot Pack
  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
  }
}


/** Opens a pack, creating a new BroadDeck, with pack's cardCount dealt cards */
function openPack(pack:Pack): BroadDeck {
  let { packType } = pack;
  let newDeck: BroadDeck;
  if (packType === 'card') newDeck = openCardPack(pack);
  else if (packType === 'planet') newDeck = openPlanetPack(pack);
  else newDeck = openTarotPack(pack); //(packType === 'tarot')

  return newDeck;
}
function openCardPack(pack:Pack): CardDeck {
  let {cardCount, packType} = pack;
  if (packType !== 'card') throw new Error('incorrect pack passed');

  let cardDeck = buildCardDeck();
  const randomCards = makeRandomCards();
  cardDeck['deck'] = randomCards;

  cardDeck = dealCards(cardDeck, cardCount);
  return cardDeck;
}
function openPlanetPack(pack:Pack): PlanetDeck {
  let {cardCount, packType} = pack;
  if (packType !== 'planet') throw new Error('incorrect pack passed');

  const planetDeck = dealPlanets(cardCount);
  return planetDeck;
}
function openTarotPack(pack:Pack): TarotDeck {
  let {cardCount, packType} = pack;
  if (packType !== 'tarot') throw new Error('incorrect pack passed');

  const tarotDeck:TarotDeck = dealTarots(cardCount); //deals tarot cards, sets up select
  return tarotDeck;
}
