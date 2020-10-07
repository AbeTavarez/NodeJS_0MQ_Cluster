`use strict`;

const zmq = require(`zeromq`);
const filename = process.argv[2];

//* Requester ///////////////////////

// Create request endpoint
const requester = zmq.socket(`req`);

// Handle replies from the responder
requester.on(`message`, (data) => {
  const response = JSON.parse(data);
  console.log(`Recieived response:`, response);
});

// Connects the request socket over TCP
requester.connect(`tcp://localhost:60401`);

for (let i = 1; i <= 5; i++) {
  // Send a request for content
  console.log(`Sending a request for ${filename}`);
  requester.send(JSON.stringify({ path: filename }));
}
