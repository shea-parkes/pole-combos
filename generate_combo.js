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

function generateCombo(size, mandatoryMove, arr) {
  const combo = [];
  const directions = [];
  if (R.equals(mandatoryMove, "None")) {
    combo.push(sampleOne(arr));
    directions.push(...R.repeat("forward", size - 1));
  } else {
    combo.push(R.find(R.propEq(mandatoryMove, "Pole Trick"), arr));
    const mandatoryPosition = Math.floor(Math.random() * size);
    for (const position of R.range(0, size)) {
      if (position < mandatoryPosition) {
        directions.push("backward");
      } else if (position > mandatoryPosition) {
        directions.push("forward");
      }
    }
  }
  const heights = [0];
  for (const direction of directions) {
    const existingNames = R.map(getTrickName, combo);
    const checkExisting = R.pipe(
      getTrickName,
      R.flip(R.includes)(existingNames),
    );
    for (const move of shuffleArray(arr)) {
      if (checkExisting(move)) {
        continue;
      }
      if (R.equals(direction, "forward")) {
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
      } else {
        if (R.isEmpty(getTransitions(move, R.head(combo)))) {
          continue;
        }
        const newAltitude = R.subtract(
          R.head(heights),
          getAltitudeChange(R.head(combo)),
        );
        if (getRange(R.append(newAltitude, heights)) > MAX_HEIGHT_RANGE) {
          continue;
        }
        combo.unshift(move);
        heights.unshift(newAltitude);
        break;
      }
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

const button = document.getElementById("generateCombo");
const outputUl = document.getElementById("comboOutput");

function handleClick() {
  outputUl.innerHTML = "";
  const selectedSize = parseInt(document.getElementById("sizeSelect").value);
  const selectedMandatoryMove =
    document.getElementById("requiredMoveSelect").value;
  const comboSteps = R.last(
    generateCombo(selectedSize, selectedMandatoryMove, window.MOVES),
  );
  for (const step of comboSteps) {
    const stepItem = document.createElement("li");
    stepItem.textContent = step;
    outputUl.appendChild(stepItem);
  }
}
button.addEventListener("click", handleClick);
