const createNode = require('../../src');

const port = Number(process.argv[2]);

const node = createNode();
let name = 'Bob';

node.listen(port, () => {
  console.log(`Welcome to your peering relationship!`);
  console.log(`Chat node is up at port: ${port}.`);
  console.log('');
  console.log(`Write "connect IP:PORT" to connect to other nodes.`);
  console.log(`Write "name NAME" to change your name.`);
  console.log(`Type amount of money to send:`);
  console.log(``);
  console.log(`Your name is "${name}"`);

  node.on('broadcast', ({ message: { name, text } }) => {
    console.log(`${name}: ${text}`);
  });

  process.stdin.on('data', (data) => {
    const text = data.toString().trim();
    let balance = 0;
    if (text.startsWith('connect')) {
      const [, ipport] = text.split(' ');
      const [ip, port] = ipport.split(':');

      console.log(`Connecting to ${ip} at ${Number(port)}...`);
      node.connect(ip, Number(port), () => {
        console.log(`Connection to ${ip} established.`);
      });
    } else if (text.startsWith('name')) {
      [, name] = text.split(' ');
      console.log(`Name changed to "${name}"`);
    } else if (text.startsWith('pay')) {
      [, pay] = text.split(' ');
      console.log(`Balance is now -${pay}`);
      node.broadcast(`You received ${pay} from ${name}. Balance is now ${pay}`);
    } else {
      node.broadcast({ name, text });
      console.log(`${'\033[F'}You: ${text} test`);
    }
  });
});

process.on('SIGINT', async () => {
  console.log('\nShutting down...');

  node.close(() => {
    process.exit();
  });
});
