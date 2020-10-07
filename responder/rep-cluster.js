`use strict`;

const cluster = require(`cluster`);
const fs = require(`fs`);
const zmq = require(`zeromq`);
const numWorkers = require(`os`).cpus().length;

// Num of CPUS
console.log(numWorkers);

//* Responder Cluster
if (cluster.isMaster) {
  // Master process creates ROUTER & DEALER sockets and binds endpoint
  const router = zmq.socket(`router`).bind(`tcp://127.0.0.1:60401`);
  const dealer = zmq.socket(`dealer`).bind(`ipc://filer-dealer.ipc`);

  // Forward messages between the router and the dealer
  router.on(`message`, (...frames) => dealer.send(frames));
  router.on(`message`, (...frames) => router.send(frames));

  // Listen for workers to come online
  cluster.on(`online`, (worker) =>
    console.log(`Worker ID: ${worker.process.pid}, is online.`)
  );

  // Fork a worker process for each CPU
  for (let i = 0; i < numWorkers; i++) {
    // forking....
    cluster.fork();
  }
} else {
  // Worker processcreate a REP socket and connect to the DEALER
  const responder = zmq.socket(`rep`).connect(`ipc://filer-dealer.ipc`);

  responder.on(`message`, (data) => {
    // Parse incoming message
    const request = JSON.parse(data);
    console.log(`${process.pid} received request for: ${request.path}`);

    // Read the file and reply with content
    fs.readFile(request.path, (err, content) => {
      responder.send(
        JSON.stringify({
          constent: content.toString(),
          timestamp: Date.now(),
          pid: process.pid,
        })
      );
    });
  });
}
