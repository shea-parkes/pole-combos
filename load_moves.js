import Papa from "papaparse";
import * as R from "rambda";
window.R = R;

const splitStates = R.pipe(R.split(","), R.map(R.trim));
const scrubMoves = R.pipe(
  R.filter(R.prop("Entry States")),
  R.map(R.evolve({ "Entry States": splitStates, "Exit States": splitStates })),
);

Papa.parse("moves.csv", {
  download: true,
  header: true,
  complete: function (results) {
    console.log("Raw results of parsing moves.csv", results.data);
    window.MOVES = scrubMoves(results.data);
  },
  error: function (error) {
    console.error("Error parsing moves.csv:", error);
  },
});
