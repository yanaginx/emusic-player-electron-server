const os = require("os");
const asyncHandler = require("express-async-handler");
const {
  getSong,
  searchSong,
  getSongData,
  downloadFile,
} = require("../utils/zingmp3_utils");

// @desc    Search songs through Zing MP3 api
// @route   GET /api/online/search?q=query
// @access  Public
const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  try {
    const result = await searchSong(q);
    // Getting the downloadable songs only:
    const songs = result.data.items.map(async (song) => {
      const songUrl = await getSong(song.encodeId);
      if (songUrl.err == 0) {
        return {
          id: song.encodeId,
          title: song.title,
          artists: song.artistsNames,
          image: song.thumbnailM,
          url: songUrl.data["128"],
        };
      }
    });
    const songsData = await Promise.all(songs);
    res.status(200).json(songsData.filter((song) => song));
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
});

// @desc    Get song's download availability from Zing MP3 api
// @route   GET /api/online/can_download/:id
// @access  Public
// const canDownload = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   try {
//     const songData = await getSong(id);
//     if (songData.err == 0) {
//       res.status(200).json({
//         status: "OK",
//         message: "Downloadable",
//       });
//     } else {
//       res.status(400).json({
//         status: "ERROR",
//         message: "Not downloadable",
//       });
//     }
//   } catch (err) {
//     res.status(400).json({
//       status: "ERROR",
//       message: err,
//     });
//   }
// });

// @desc    Download song from Zing MP3 api
// @route   GET /api/online/download/:id
// @access  Public
const download = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const body = await getSongData(id);
    const { title, url } = body;
    const disinfectedTitle = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
    const fileName = `${disinfectedTitle}.mp3`;
    if (os.platform == "win32") {
      const downloaded = await downloadFile(url, "D:\\Music", fileName);
      if (!downloaded) {
        res.status(400).json({
          message: "Something went wrong",
        });
      } else {
        res.status(200).json({
          message: "Successfully downloaded",
        });
      }
    } else if (os.platform == "linux") {
      const downloaded = await downloadFile(url, "/home/music", fileName);
      if (!downloaded) {
        res.status(400).json({
          message: "Something went wrong",
        });
      } else {
        res.status(200).json({
          message: "Successfully downloaded",
        });
      }
    } else {
      res.status(200).json({
        message: "Not supported",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "ERROR",
      message: err,
    });
  }
});

module.exports = { search, download };
