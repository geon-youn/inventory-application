# Inventory Application

Inspired by the osu! beatmapset page. You can create new osu! modes and create beatmaps for them.

# How to run

1. `npm install` to install all the modules required.
2. Create a `.env` file and set up a `MONGODB` variable set to your MongoDB Atlas connection url.
3. `node populatedb` to populate the database with some songs and the main modes. 
4. `npm run serverstart` to start the local server.