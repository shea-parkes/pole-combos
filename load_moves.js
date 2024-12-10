import Papa from "https://cdn.skypack.dev/papaparse@5.4.1";
import * as R from "https://cdn.skypack.dev/rambda";
window.R = R;

const scrub_moves = R.pipe(
  R.filter(R.prop("Entry States")),
  R.map(
    R.evolve({ "Entry States": R.split(","), "Exit States": R.split(",") }),
  ),
);

Papa.parse("moves.csv", {
  download: true,
  header: true,
  complete: function (results) {
    console.log("Raw results of parsing moves.csv", results.data);
    window.MOVES = scrub_moves(results.data);
  },
  error: function (error) {
    console.error("Error parsing moves.csv:", error);
  },
});
