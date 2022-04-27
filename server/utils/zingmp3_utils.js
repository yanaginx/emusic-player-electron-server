const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const VERSION = "1.5.4";
const URL = "https://zingmp3.vn";
const SECRET_KEY = "2aa2d1c561e809b267f3638c4a307aab";
const API_KEY = "88265e23d4284f25963e6eedac8fbfa3";
const CTIME = String(Math.floor(Date.now() / 1000));

const getHash256 = (a) => {
  return crypto.createHash("sha256").update(a).digest("hex");
};

const getHmac512 = (str, key) => {
  let hmac = crypto.createHmac("sha512", key);
  return hmac.update(Buffer.from(str, "utf8")).digest("hex");
};

const hashParam = (path, id) => {
  if (id == undefined) {
    return getHmac512(
      path + getHash256(`ctime=${CTIME}version=${VERSION}`),
      SECRET_KEY
    );
  } else {
    return getHmac512(
      path + getHash256(`ctime=${CTIME}id=${id}version=${VERSION}`),
      SECRET_KEY
    );
  }
};

const getCookie = async () => {
  try {
    let res = await axios.get(`${URL}`);
    return res.headers["set-cookie"][1];
  } catch (err) {
    console.error(err);
  }
};

const client = axios.create({
  baseURL: `${URL}`,
});

client.interceptors.response.use((res) => res.data); // setting axiosresponse data

const requestZingMp3 = async (path, qs) => {
  let cookie = await getCookie();

  try {
    let res = await client.get(path, {
      headers: {
        Cookie: `${cookie}`,
      },
      params: {
        ...qs,
        ctime: CTIME,
        version: VERSION,
        apiKey: API_KEY,
      },
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};

const getSong = async (songId) => {
  return await requestZingMp3("/api/v2/song/get/streaming", {
    id: songId,
    sig: hashParam("/api/v2/song/get/streaming", songId),
  });
};

const getInfoSong = async (songId) => {
  return await requestZingMp3("/api/v2/song/get/info", {
    id: songId,
    sig: hashParam("/api/v2/song/get/info", songId),
  });
};

const getSongData = async (songId) => {
  let song = await getSong(songId);
  let info = await getInfoSong(songId);
  return {
    title: info.data.title,
    url: song.data["128"],
  };
};

const searchSong = async (name) => {
  return await requestZingMp3("/api/v2/search", {
    q: name,
    sig: hashParam("/api/v2/search"),
  });
};

// const downloadFile = async (fileUrl, downloadFolder, fileName) => {
//   // The path of the downloaded file on our machine
//   const localFilePath = path.join(downloadFolder, fileName);
//   try {
//     console.log("Went here");
//     const response = await axios({
//       method: "GET",
//       url: fileUrl,
//       responseType: "stream",
//     });
//     console.log("Another went here");
//     const w = response.data.pipe(fs.createWriteStream(localFilePath));
//     w.on("finish", () => {
//       console.log("Download successful");
//       return [localFilePath, null];
//     });
//   } catch (err) {
//     return [null, err];
//   }
// };

async function downloadFile(fileUrl, outputLocationPath, fileName) {
  try {
    const localFilePath = path.resolve(__dirname, outputLocationPath, fileName);
    const writer = fs.createWriteStream(localFilePath);
    return axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    }).then((response) => {
      //ensure that the user can call `then()` only when the file has
      //been downloaded entirely.

      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error = null;
        writer.on("error", (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on("close", () => {
          if (!error) {
            resolve(true);
          }
          //no need to call the reject here, as it will have been called in the
          //'error' stream;
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getSong,
  getInfoSong,
  getSongData,
  searchSong,
  downloadFile,
};
