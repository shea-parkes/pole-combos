import * as R from "rambda";

const altitudeChanges = {
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
const getAltitudeChange = R.pipe(
  R.path("Altitude Change"),
  R.flip(R.path)(altitudeChanges),
);
const getRange = R.converge(R.subtract, [Math.max, Math.min]);

function generateCombo(size, arr) {
  const combo = [sampleOne(arr)];
  const heights = [0];
  for (let i = 1; i < size; i++) {
    const existingNames = R.map(getTrickName, combo);
    const checkExisting = R.pipe(
      getTrickName,
      R.flip(R.includes)(existingNames),
    );
    for (const move of shuffleArray(arr)) {
      if (checkExisting(move)) {
        continue;
      }
      if (R.isEmpty(getTransitions(R.last(combo), move))) {
        continue;
      }
      const newAltitude = R.add(R.last(heights), getAltitudeChange(move));
      if (getRange(R.append(newAltitude, heights)) > MAX_HEIGHT_RANGE) {
        continue;
      }
      combo.push(move);
      heights.push(newAltitude);
      break;
    }
  }

  const descriptions = [];
  for (let i = 0; i < size; i++) {
    if (R.equals(0, i)) {
      const firstTransitionState = R.pipe(
        R.path("Entry States"),
        sampleOne,
      )(combo[i]);
      descriptions.push(
        `Start with ${firstTransitionState} into ${getTrickName(combo[i])}`,
      );
    } else {
      const chosenTransitionState = sampleOne(
        getTransitions(combo[i - 1], combo[i]),
      );
      descriptions.push(
        `Transition via ${chosenTransitionState} into ${getTrickName(combo[i])}`,
      );
    }
  }

  return [combo, heights, descriptions];
}

window.generateCombo = generateCombo;
