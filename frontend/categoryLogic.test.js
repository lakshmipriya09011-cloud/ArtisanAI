const assert = require('node:assert/strict');
const { normalizeMarketplaceCategory } = require('./categoryLogic.js');

assert.equal(normalizeMarketplaceCategory('best-sellers'), 'best-sellers');
assert.equal(normalizeMarketplaceCategory('new-arrivals'), 'new-arrivals');
assert.equal(normalizeMarketplaceCategory('todays-deals'), 'todays-deals');
assert.equal(normalizeMarketplaceCategory('Pottery'), 'Pottery');
assert.equal(normalizeMarketplaceCategory('Textiles & Weaving'), 'Textiles & Weaving');
assert.equal(normalizeMarketplaceCategory('Painting'), 'Painting');
assert.equal(normalizeMarketplaceCategory('Jewelry'), 'Jewelry');
assert.equal(normalizeMarketplaceCategory('Woodwork'), 'Woodwork');
assert.equal(normalizeMarketplaceCategory('home decor'), 'Pottery');
assert.equal(normalizeMarketplaceCategory('paintings'), 'Painting');
console.log('categoryLogic tests passed');
