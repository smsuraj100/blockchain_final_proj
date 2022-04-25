// const IPFS = require("ipfs-http-client");
// const { create } = require("ipfs-http-client");

// const ipfs = create({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "http",
// });
// const ipfs = new IPFS({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "http",
// });

import { create } from "ipfs-http-client";
const ipfs = create("https://ipfs.infura.io:5001/api/v0");

export default ipfs;
