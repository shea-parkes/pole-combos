# Pole Combo Generator

A simple tool to generate potential pole combos.

Currently hosted via GitHub pages at the following URL: https://shea-parkes.github.io/pole-combos/

## Developer Notes

This is predominantly focused on an algorithm for generating coherent pole move combos. Some developer focused notes:

- JavaScript was chosen for the key business logic to allow easy and early user feedback.
- Almost no time was spent/considered for the user interface at this time.
- The whole solution is currently intended to execute in-browser (i.e. there is no server side processing).
- The solution was authored using current-day in-browser JavaScript module support (with no build/bundle step either).
- Any JavaScript dependencies are directly loaded from CDN (usually [Skypack](https://www.skypack.dev/) so they can be imported like proper modules).
- [prettier](https://prettier.io/) is currently leveraged for auto-formatting via a [direct pre-commit hook](https://prettier.io/docs/en/precommit.html#option-4-shell-script).
