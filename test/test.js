var data = require('..');
var assert = require('assert');

describe('list-of-programming-languages', function() {
  it('should be available as a JS object', function() {
    assert.equal(data.itemListElement.filter(itemListElement => itemListElement.item.name === 'JavaScript').length, 1);
  });
});
