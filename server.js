const net = require('net');
const server = net.createServer();
const PORT = 4000;

let clients = [];
let step = 1;
let model = {
    1: 
`Output
    Starting the survey
    type: text
    value: What is your name?
Input:`,
    2: 
`Output: 
    type: radio
    value: what is your gender?
    options: [Male, Female]
Input:`,
    3: 
`Output:
    type: checkbox
    value: what are your hobbies?
    options: [Fishing, Cooking, Swimming]
Input:`};

const broadcast = (input, client, step) => {
    clients.forEach((socket) => {
        if(step === 4) {
    socket.write(`Output: 
A ${gender} ${name} who likes ${hobbies}.`)
            socket.write('end');
        }
        else if(socket === client) {
           socket.write(model[step]);
       }
       else {
           socket.write(`${input} \n${model[step]}`);
       }
   })
}

server.on('connection', (client) => {
    console.log(`A client connected from port ${client.remotePort}.`);

    clients.push(client);
    client.write('Input: ')

    client.on('data', (data) => {
        let input = data.toString();
        switch(step) {
            case 1:
                // Asks for the name
                broadcast(input, client, step);
                break;
            case 2:
                // Asks for the gender
                broadcast(input, client, step);
                break;
            case 3:
                // Asks for the hobbies
                broadcast(input, client, step);
                break;
            
            case 4:
                // Will disconnect the client sockets.
                broadcast(input, client, step);
                break;
        }
        step++;
    })

    client.once('close', () => {
        console.log('Server is now closed.')
    })
});

server.listen(PORT, () => {
console.log(`Server is listening to port ${PORT}`);
});

