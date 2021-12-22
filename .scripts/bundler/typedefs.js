/**
 * 
 * @typedef Config
 * @property {Array.<string>} curators
 */

/**
 * 
 * @typedef BundleInfo
 * @property {string} name
 * @property {string} description
 * @property {string} output
 * @property {boolean} hidden
 * @property {Array.<string>} files
 */

/**
 * 
 * @typedef CuratorInfo
 * @property {string} name
 * @property {string} description
 * @property {Array.<BundleInfo>} bundles
 */

/**
 * 
 * @typedef WishlistItem
 * @property {string} name
 * @property {string} description
 * @property {string} originalWishlist
 * @property {Array.<Array.<number>>} plugs
 */

/**
 * 
 * @typedef Wishlist
 * @property {string} name
 * @property {string} description
 * @property {Array.<WishlistItem>} data
 */