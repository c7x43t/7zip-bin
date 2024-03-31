"use strict";

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getPath() {
  if (process.env.USE_SYSTEM_7ZA === "true") {
    return "7za";
  }

  if (process.platform === "darwin") {
    return path.join(__dirname, "mac", process.arch, "7za");
  }
  else if (process.platform === "win32") {
    return path.join(__dirname, "win", process.arch, "7za.exe");
  }
  else {
    return path.join(__dirname, "linux", process.arch, "7za");
  }
}

function makeExecutable(filePath) {
  fs.chmod(filePath, 0o755, (err) => {
    if (err) {
      console.error(`Failed to set execute permissions for ${filePath}: ${err}`);
      return;
    }
    if (fs.existsSync(filePath)) {
      const cmd = `chmod +x "${filePath}"`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error setting executable permission: ${error}`);
          return;
        }
        console.log(`${filePath} made executable`);
      });
    } else {
      console.error(`File does not exist: ${filePath}`);
    }
  });
}

// Export the function to get the path, and let users of the module decide when to make it executable
exports.getPath7za = function () {
  const path = getPath();
  // Only attempt to set executable permissions on POSIX systems (Linux/macOS)
  if (process.platform !== "win32") {
    makeExecutable(path);
  }
  return path;
};

exports.path7x = path.join(__dirname, "7x.sh");