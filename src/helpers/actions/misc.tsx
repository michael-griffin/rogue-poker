//TODO: this is pretty unorganized. Current plan is to try and mirror zustand
//and have an 'actions' section that can accomplish most of this.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const readline = require('readline-sync');

import {
  RunStatus,
  RoundStatus,
  CardDeck,
} from '../../types/misc'
import { baseHandSize } from '../constants';


export function chooseIndices(instructions='simple', count=1, maxSize=baseHandSize){
  let selectInds:number[]=[];
  if (instructions === 'simple'){
    selectInds = chooseSimple(count, maxSize);
  } else if (instructions === 'random'){
    selectInds = chooseRandom(count, maxSize);
  } else if (instructions === 'manual'){
    selectInds = chooseManual(count, maxSize);
  }

  return selectInds;
}


export function chooseManual(count:number=1, maxSize=baseHandSize){
  if (count > maxSize || count <= 0) throw new Error("Invalid parameters");

  const promptStr = `Choose ${count} indices between 0 and ${maxSize-1}, separated by commas\n`;

  let validChoice = false;
  let indices: number[] = [];
  while (!validChoice){
    validChoice = true;
    const strIndices:string[] = readline.question(promptStr).split(',');
    indices = strIndices.map(num => +num);

    const uniqIndices = [...new Set(indices)];
    const hasDups = indices.length !== uniqIndices.length;
    const wrongCount = indices.length !== count;
    const outOfBounds = indices.some(num => num > maxSize - 1 || num < 0);
    const hasNaNs = indices.some(val => Number.isNaN(val));
    if (wrongCount || outOfBounds || hasNaNs || hasDups) {
      validChoice = false;
      if (hasDups) console.log(`Each number should only be chosen once`);
      if (wrongCount) console.log(`Please enter exactly ${count} numbers`);
      if (outOfBounds) console.log(`Numbers must be between 0 and ${maxSize - 1}`);
      if (hasNaNs) console.log(`Invalid char, enter only numbers separated by commas`);
    }
  }

  return indices;
}

/** Returns an array with [count] indices, counting up from 0.*/
export function chooseSimple(count:number, maxSize:number=baseHandSize){
  let allIndices = Array(maxSize).fill(-1).map((_, ind) => ind);
  let indices = allIndices.slice(0, count);
  return indices;
}

/** Returns an array with [count] random indices.
 * Indices are between 0 and maxSize, exclusive*/
export function chooseRandom(count:number, maxSize:number=baseHandSize){
  let allIndices = Array(maxSize).fill(-1).map((_, ind) => ind);
  let indices = shuffle(allIndices).slice(0,count);
  return indices;
}


/** Given an array, returns a random element */
export function pickRandom(base:any[]){
  let arr = structuredClone(base);
  let choice = Math.floor(Math.random() * arr.length);
  return arr[choice];
}

/** Given an array, returns a new array with shuffled contents */
export function shuffle(base:any[]) {
  let arr = structuredClone(base);
  for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
  return base;
}