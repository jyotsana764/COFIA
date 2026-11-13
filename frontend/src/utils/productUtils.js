/**
 * Extracts a normalized, stable product identifier from a product object.
 * Trims whitespace and converts to string for consistent comparison.
 */
export const getNormalizedProductId = (product) => {
  if (!product) return '';
  const rawId = product._id ?? product.id;
  if (rawId !== undefined && rawId !== null && String(rawId).trim() !== '') {
    return String(rawId).trim();
  }
  // Safe composite fallback only if primary ID is completely absent
  if (product.name) {
    return `fallback_${String(product.name).trim().toLowerCase()}_${String(product.category || '')}_${String(product.subcategory || product.subCategory || '')}`;
  }
  return '';
};
/**
 * Deduplicates a list of products within a section while preserving:
 * - Product data integrity (prices, sizes, images, descriptions, etc.)
 * - Original item order (first occurrence retained)
 * - Distinct products that happen to share similar or identical names
 *
 * @param {Array} productList - The array of products to deduplicate.
 * @returns {Array} - The deduplicated array of products.
 */
export const deduplicateProducts = (productList) => {
  if (!Array.isArray(productList) || productList.length === 0) {
    return [];
  }

  const seenIds = new Set();
  const uniqueProducts = [];

  for (const product of productList) {
    if (!product) continue;
    const normId = getNormalizedProductId(product);

    if (normId) {
      if (seenIds.has(normId)) {
        continue; // Skip duplicate instance in this section
      }
      seenIds.add(normId);
    }

    uniqueProducts.push(product);
  }

  return uniqueProducts;
};
