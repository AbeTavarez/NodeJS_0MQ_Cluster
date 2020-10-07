`use strict`;

const cluster = require(`cluster`);
const { fs } = require(`fs`);
const zmq = require(`zeromq`);
const numWorkers = require(`os`).cpus().length;

console.log(numWorkers);

//* Responder Cluster
if (cluster.isMaster) {
  console.log(`master`);
}
