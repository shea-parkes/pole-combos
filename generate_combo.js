import * as R from "rambda";

const altitudeChange = {
  Up: 1,
  Stationary: 0,
  Down: -1,
};

const MAX_HEIGHT_RANGE = 3;

const shuffleArray = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const sampleOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getTrickName = R.path("Pole Trick");
const getTransitions = (src, dst) =>
  R.intersection(src["Exit States"], dst["Entry States"]);

function generateCombo(size, arr) {
  const combo = [sampleOne(arr)];
  while (combo.length < size) {
    const existingNames = R.map(getTrickName, combo);
    const checkExisting = R.pipe(
      getTrickName,
      R.flip(R.includes)(existingNames),
    );
    for (const move of shuffleArray(arr)) {
      if (checkExisting(move)) {
        continue;
      }
      if (R.not(getTransitions(R.last(combo), move))) {
        continue;
      }
      combo.push(move);
      break;
    }
  }

  return combo;
}

window.generateCombo = generateCombo;
