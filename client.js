const net = require('net');
const readline = require('readline');
const client = new net.Socket(); 
const PORT = 4000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

client.connect(PORT, () => {
    client.on('data', (data) => {
        console.log(data.toString());
    }); 

    client.once('close', () => { 
        console.log('Client disconnected from the server'); 
        process.exit();
    }); 
    
    client.on('error', (err) => { 
        console.error(err); 
    }); 
    
});

rl.on('line', line => {
    client.write(line)
});