import Papa from "https://cdn.skypack.dev/papaparse@5.4.1";
import * as R from "https://cdn.skypack.dev/rambda";
window.R = R;

const cleaner = R.filter(R.pipe(R.propEq("", "Entry States"), R.not));

Papa.parse("moves.csv", {
  download: true,
  header: true,
  complete: function (results) {
    console.log("Parsed Results:", results.data);
    window.moves = cleaner(results.data);
  },
  error: function (error) {
    console.error("Error:", error);
  },
});
