const loudness = require("loudness");

async function getVolume() {
  const vol = await loudness.getVolume();
  console.log(vol);
}

async function setVolume() {
  await loudness.setVolume(45);
}

getVolume();
setVolume();
getVolume();
