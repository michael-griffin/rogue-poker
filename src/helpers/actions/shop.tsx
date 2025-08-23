import {
  RunStatus,
  ShopStock,
  ShelfItem,
  Pack,
  VoucherTypes,
  Planet,
  Tarot,
  Joker,
  Card
} from '../../types/misc';

//import {baseHandSize, rankNames, chipValues, shopInfo, allVouchers,
//  scoreGoals, baseScores, levelUps} from './constants';
import { allVouchers, shopInfo } from "../constants";
import { shuffle } from '../misc';
import { allTarotsList } from '../cards/tarots'; //allTarotFunctions, dealTarots
import { allPlanetsList } from '../cards/planets'; //, dealPlanets, levelUpHand
import { allJokerFunctions, findActiveJokers,  // uncommonJokers
  commonJokersList, uncommonJokersList, rareJokersList } from "../cards/jokers";

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


