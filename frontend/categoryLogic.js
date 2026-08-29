function normalizeMarketplaceCategory(category) {
  if (!category) return 'all';

  const value = String(category).trim();

  const directMatches = new Set([
    'best-sellers',
    'new-arrivals',
    'todays-deals',
    'Pottery',
    'Textiles & Weaving',
    'Painting',
    'Jewelry',
    'Woodwork',
    'all'
  ]);

  if (directMatches.has(value)) return value;

  const lower = value.toLowerCase();

  if (lower === 'paintings' || lower === 'painting') return 'Painting';
  if (lower === 'home decor' || lower === 'home-decor' || lower === 'home decor') return 'Pottery';
  if (lower === 'textiles' || lower === 'textile') return 'Textiles & Weaving';
  if (lower === 'jewellery' || lower === 'jewelery') return 'Jewelry';
  if (lower === 'woodcraft' || lower === 'woodcrafts') return 'Woodwork';
  if (lower === 'ceramics') return 'Pottery';

  return value;
}

if (typeof module !== 'undefined') {
  module.exports = { normalizeMarketplaceCategory };
}
