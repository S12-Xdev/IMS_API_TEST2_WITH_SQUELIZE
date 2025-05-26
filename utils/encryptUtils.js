const crypto = require("crypto");

function generateHash(data) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

const dataToHash = "This is the string to hash";
const hashedData = generateHash(dataToHash);

console.log(`Original data: ${dataToHash}`);
console.log(`Hashed data: ${hashedData}`);
