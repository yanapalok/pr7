'use strict';

function runUnitTests() {
  
  console.assert(validateInput('Біг Мак') === true, 'validateInput: валідний текст має проходити');
  console.assert(validateInput('') === false, 'validateInput: порожній рядок має відхилятись');
  console.assert(validateInput('   ') === false, 'validateInput: рядок із пробілів має відхилятись');
  console.assert(validateInput(null) === false, 'validateInput: null має відхилятись');
  console.assert(validateInput(123) === false, 'validateInput: число має відхилятись');
  console.assert(validateInput('<h1>Test</h1>') === true, 'validateInput: HTML-рядок це звичайний текст');

  
  console.assert(filterItems(MENU_ITEMS, '').length === MENU_ITEMS.length, 'filterItems: порожній запит повертає все');
  console.assert(filterItems(MENU_ITEMS, '   ').length === MENU_ITEMS.length, 'filterItems: пробіли дорівнюють порожньому запиту');
  console.assert(filterItems(MENU_ITEMS, 'БІГ').length === 1, 'filterItems: пошук нечутливий до регістру');
  console.assert(filterItems(MENU_ITEMS, 'мак').length === 2, 'filterItems: часткова назва знаходить кілька позицій');
  console.assert(filterItems(MENU_ITEMS, 'zzz').length === 0, 'filterItems: відсутній збіг дає порожній масив');
  console.assert(filterItems([], 'мак').length === 0, 'filterItems: порожній масив дає порожній результат');

  
  console.assert(isValidRoute('menu', routes) === true, 'isValidRoute: menu існує');
  console.assert(isValidRoute('ui-kit', routes) === true, 'isValidRoute: ui-kit існує');
  console.assert(isValidRoute('nope', routes) === false, 'isValidRoute: невідомий маршрут відхиляється');
  console.assert(isValidRoute('', routes) === false, 'isValidRoute: порожній рядок відхиляється');
  console.assert(isValidRoute(undefined, routes) === false, 'isValidRoute: undefined відхиляється');

  
  console.assert(formatTime(0) === '00:00', 'formatTime: 0 с дає 00:00');
  console.assert(formatTime(65) === '01:05', 'formatTime: 65 с дає 01:05');
}

runUnitTests();