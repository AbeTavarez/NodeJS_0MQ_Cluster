`use strict`;

const { cluster } = require(`cluster`);
const { fs } = require(`fs`);
const zmq = require(`zeromq`);
const numWorkers = require(`os`).cpus().length;

//* Responder Cluster
console.log(numWorkers);
