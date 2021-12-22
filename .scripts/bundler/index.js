import fs from 'fs-extra';

/**
 * 
 * @param {string} curator 
 * @returns {Promise<CuratorInfo>}
 */
async function loadCuratorInfo(curatorName) {
    const buffer = await fs.readFile(`./curators/${curatorName}/index.json`);
    let string = buffer.toString();
    let curatorInfo = JSON.parse(string);
    return curatorInfo;
}

/**
 * 
 * @returns {Promise<Config>}
 */
async function loadConfig() {
    const buffer = await fs.readFile(`./config/config.json`);
    let string = buffer.toString();
    let config = JSON.parse(string);
    return config;
}

/**
 * @param {string} path
 * @returns {Promise<Wishlist>}
 */
async function loadWishlist(path) {
    const buffer = await fs.readFile(`./${path}`);
    let string = buffer.toString();
    let wishlist = JSON.parse(string);
    return wishlist;
}

/**
 * @param {string} path
 * @param {Wishlist} data
 * @returns {Promise<void>}
 */
 async function saveWishlist(path, data) {
    await fs.writeJSON(`./${path}`, data);
}

/**
 * @param {string} name
 * @param {string} description
 * @returns {Wishlist}
 */
function createWishlist(name, description) {
    let wishlist = {
        name,
        description,
        data: []
    };
    return wishlist;
}


/**
 * @param {CuratorInfo} curator
 * @returns {Promise<void>}
 */
async function buildCuratorBundles(curator) {
    for (let bundle of curator.bundles) {
        const wishlist = await buildBundle(bundle, curator);
        await saveWishlist(bundle.output, wishlist);
    }
}

/**
 * @param {BundleInfo} bundle
 * @param {CuratorInfo} curator
 * @returns {Promise<Wishlist>}
 */
async function buildBundle(bundle, curator) {
    let wishlist = createWishlist(bundle.name || curator.name, bundle.description || curator.description );
    for(let file of bundle.files){
        let wishlistFile = await loadWishlist(file);
        let originalName = file.replace('curators/', '').replace('.json', '');
        for(let build of wishlistFile.data){
            /** @type {WishlistItem} **/
            let bundleBuild = {
                ...build,
                originalWishlist:originalName
            };
            wishlist.data.push(bundleBuild);
        }
    }
    return wishlist;
}

async function run() {
    const config = await loadConfig();
    const curatorParam = process.argv[2];
    const curators = curatorParam ? config.curators.filter((c) => c == curatorParam) : config.curators;
    for (let c of curators) {
        const curator = await loadCuratorInfo(c);
        await buildCuratorBundles(curator);
    }
}

run();