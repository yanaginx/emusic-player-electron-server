// const asyncHandler = require("express-async-handler");
// const { PythonShell } = require("python-shell");

// // @desc    Get emotion from camera
// // @route   GET /api/fer
// // @access  Public (for now, will be private later)
// const getEmotion = asyncHandler(async (req, res) => {
//   let pyshell = new PythonShell("./server/python_scripts/fer.py", {
//     mode: "json",
//   });

//   pyshell.on("stderr", function (stderr) {
//     console.log("🚀 ~ file: ferController.js ~ line 49 ~ stderr", stderr);
//   });

//   pyshell.on("message", function (message) {
//     return res.status(200).json(message);
//   });
// });

// module.exports = { getEmotion };

const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");

const ferOutput = spawn("python", ["-u", "./server/python_scripts/fer.py"]);
let output = null;

ferOutput.on("spawn", () => {
  console.log("SCRIPT SPAWN!, Waiting for output");
});

const waitForOutput = () => {
  return new Promise((resolve, reject) => {
    ferOutput.stdout.on("data", (data) => {
      console.log(
        "🚀 ~ file: ferController.js ~ line 49 ~ stdout",
        data.toString()
      );
      resolve(JSON.parse(data.toString()));
    });
    ferOutput.stdout.on("error", (err) => {
      console.log(
        "🚀 ~ file: ferController.js ~ line 49 ~ stderr",
        err.toString()
      );
      reject(data.toString());
    });
  });
};

// @desc    Get emotion from camera
// @route   GET /api/fer
// @access  Public (for now, will be private later)
const getEmotion = asyncHandler(async (req, res) => {
  // For debugging
  // ferOutput.stderr.on("data", (data) => {
  //   return res.status(500).json({
  //     error: data.toString(),
  //   });
  // });
  ////////////////////////////////////////////////
  output = null;
  ferOutput.stdin.write(`Get emotion \n`);

  // if (output) {
  //   res.status(200).json(output);
  // } else {
  //   setTimeout(() => {
  //     res.status(200).json(output);
  //   }, 10000);
  // }
  output = await waitForOutput();
  if (output) {
    res.status(200).json(output);
  } else {
    res.status(500).json({
      error: "Something went wrong!",
    });
  }

  // ferOutput.on("close", (code) => {
  //   if (code === 0) {
  //     res.status(200).json(output);
  //   } else {
  //     res.status(400).json({
  //       code: process.env.NODE_ENV === "production" ? null : code,
  //       message: "Somethings went wrong!",
  //     });
  //   }
  // });
});

module.exports = { getEmotion };
