import './typedefs.js';
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
 * @param {any} data
 * @returns {Promise<void>}
 */
async function saveJSONData(path, data) {
    await fs.createFile(`./${path}`);
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
        await saveJSONData(bundle.output, wishlist);
        if (!bundle.hidden) {
            await saveJSONData(`deliverables/bundles/${bundle.output}`, wishlist);
        }

    }
}

/**
 * @param {CuratorInfo} curator
 */
async function buildCuratorPartials(curator) {
    let files = new Set();
    for (let bundle of curator.bundles) {
        bundle.files.forEach(files.add, files);
    }
    for (let file of files) {
        let wishlistFile = await loadWishlist(file);
        let partialFileName = file.replace('curators/', 'deliverables/partials/');
        await saveJSONData(partialFileName, wishlistFile);
    }
}

/**
 * @param {string[]} curators
 */
 async function buildWishlistsIndex(curators) {
     /** @type {WishlistIndexFolder} */
    let root = {files:[],folders:[]};
    const cdnFilesRoot = "https://cdn.jsdelivr.net/gh/LittleLightForDestiny/littlelight_wishlists/deliverables";
    for(let curatorName of curators){
        const curator = await loadCuratorInfo(curatorName);
        let bundles = curator.bundles.filter((b)=>!b.hidden);
        /** @type {Set<string>} */
        let partials = new Set();
        for(let bundle of bundles){
            /** @type {WishlistIndexFile} */
            const bundleFile = {
                name: bundle.name,
                description: bundle.description,
                url: `${cdnFilesRoot}/bundles/${bundle.output}`
            };
            root.files.push(bundleFile);
            bundle.files.forEach(partials.add, partials);
        }
        /** @type {WishlistIndexFolder} */
        let curatorFolder = {
            name: curator.name,
            description: curator.description,
            files: []
        };
        for(let partialPath of partials){
            let wishlist = await loadWishlist(partialPath);
            /** @type {WishlistIndexFile} */
            let partialFile = {
                name: wishlist.name,
                description: wishlist.description,
                url: `${cdnFilesRoot}/partials/${partialPath.replace('curators/', '')}`
            };
            curatorFolder.files.push(partialFile);
        }
        if(curatorFolder.files.length > 0){
            root.folders.push(curatorFolder);
        }
    }
    saveJSONData(`deliverables/index.json`, root);
}

/**
 * @param {BundleInfo} bundle
 * @param {CuratorInfo} curator
 * @returns {Promise<Wishlist>}
 */
async function buildBundle(bundle, curator) {
    let wishlist = createWishlist(bundle.name || curator.name, bundle.description || curator.description);
    for (let file of bundle.files) {
        let wishlistFile = await loadWishlist(file);
        let originalName = file.replace('curators/', '').replace('.json', '');
        for (let build of wishlistFile.data) {
            /** @type {WishlistItem} **/
            let bundleBuild = {
                ...build,
                originalWishlist: originalName
            };
            wishlist.data.push(bundleBuild);
        }
    }
    return wishlist;
}

async function run() {
    const config = await loadConfig();
    const curatorParam = process.argv[2];
    if(curatorParam == null){
        await fs.rm('./deliverables', {recursive:true});    
    }
    const curators = curatorParam ? config.curators.filter((c) => c == curatorParam) : config.curators;
    for (let c of curators) {
        const curator = await loadCuratorInfo(c);
        await buildCuratorBundles(curator);
        await buildCuratorPartials(curator);
    }
    if(curatorParam == null){
        await buildWishlistsIndex(curators);
    }
}

run();