import fs from 'fs-extra';
import axios from 'axios';

async function clean(url) {
    const result = await axios.get(url);
    console.log(result.data);
}

async function cleanDir(path){
    let all = await fs.readdir(path, {withFileTypes:true});
    const files = all.map((f)=>f.name).filter((file) => file.indexOf('.json') > -1);
    const dirs = all.filter((f)=>f.isDirectory()).map((f)=>f.name);
    
    for (let file of files) {
        await clean(`https://purge.jsdelivr.net/gh/LittleLightForDestiny/littlelight_wishlists@HEAD/${path}/${file}`);
    }

    for(let dir of dirs){
        await cleanDir(`${path}/${dir}`);
    }
}

async function run() {
    await cleanDir('deliverables');
}

run();