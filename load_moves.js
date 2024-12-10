import * as Papa from 'https://cdn.skypack.dev/papaparse@5.4.1';
Papa.parse('moves.csv', {
    download: true,
    header: true,
    complete: function(results) {
        console.log('Parsed Results:', results.data);
    },
    error: function(error) {
        console.error('Error:', error);
    }
});
