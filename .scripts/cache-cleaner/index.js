import fs from 'fs-extra';
import axios from 'axios';

async function run() {
    let files = await fs.readdir('./');
    files = files.filter((file) => file.indexOf('.json') > -1 && file.indexOf('package.json') < 0);
    for (let file of files) {
        await clean(`https://purge.jsdelivr.net/gh/LittleLightForDestiny/littlelight_wishlists/${file}`);
    }
}

async function clean(url) {
    const result = await axios.get(url);
    console.log(result.data);
}

run();