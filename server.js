const net = require('net');
const PORT = 4000;

const server = net.createServer((c) => {
    c.on('error', (err) => {
        console.log('Error');
    })
});

let hasSurveyStarted, firstClientResponse, name, gender, hobbies;
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

const selectGender = (input) => {
    genders = ['male', 'female'];
    if(genders.indexOf(input.toLowerCase()) === -1) {
        clients.forEach((socket) => {
            socket.write(`Please enter from one of the choices.`);
        })
        step--;
    }
    else {
        gender = input;
    }
}

const selectHobbies = (input) => {
    hobbySelection = ['fishing', 'cooking', 'swimming'];
    let isHobbyValid = input.split(',').every((hobby) => {
        return hobbySelection.indexOf(hobby.trim().toLowerCase()) > -1;
    });
    if(!isHobbyValid) {
        clients.forEach((socket) => {
            socket.write(`Please enter from one of the choices.`);
        })
        step--;
    }
    else {
        hobbies = input;
    }
}

const showSurveyHistory = (client) => {
    if(!hasSurveyStarted) {
        client.write('Input: ');
    }
    else {
        for(let i=0; i<step; i++) {
            surveyHistory = [`Input:\n${firstClientResponse}\n${model[1]}`, ``, `\n${name}\n${model[2]}`, `${gender}\n${model[3]}`];
            client.write(surveyHistory[i]);
        }
    }
}

server.on('connection', (client) => {
    console.log(`A client connected from port ${client.remotePort}.`);

    clients.push(client);
    // client.write('Input: ')
    showSurveyHistory(client);

    client.on('data', (data) => {
        hasSurveyStarted = true;
        let input = data.toString();
        switch(step) {
            case 1:
                firstClientResponse = input;
                // Asks for the name
                broadcast(input, client, step);
                break;
            case 2:
                name = input;
                // Asks for the gender
                broadcast(input, client, step);
                break;
            case 3:
                selectGender(input);
                // Asks for the hobbies
                broadcast(input, client, step);
                break;
            
            case 4:
                selectHobbies(input);
                // Will disconnect the client sockets.
                broadcast(input, client, step);
                server.close();
                break;
        }
        step++;
    })
    client.once('close', () => {
        console.log('A client disconnected.')
    })
});
  
server.listen(PORT, () => {
console.log(`Server is listening to port ${PORT}`);
});