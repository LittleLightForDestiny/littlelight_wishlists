# How to contribute

- If you're already added as a repository contributor, create a new branch, if you're not, fork this repo.
- If you don't have a folder at [contributors](contributors) yet, duplicate the [_example](contributors/_example) folder with a new one named after you.
- Create a new one or edit a wishlist using [Little Light Wishlist Manager](https://wishlists.littlelight.club)
- After you're done, export it in Little Light format. Remember to check 'JSON pretty print' to make diffs easier to read.
- Save your files inside the `curators/{name}/{input_type}` folder structure. It's not mandatory but recommended to keep your files organized by season.
- Edit the `curators/{name}/index.json` file to add descriptions and map the files for your bundles.
- on bundles, `output` is the name of the resulting file, and files are the files that should be mixed to create the bundle.
- Send a pull request to `master` branch, once it is approved and merged, the bundles should be automatically rebuilt based on the new files.