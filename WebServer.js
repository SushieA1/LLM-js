const http = require("http");
const fs = require("fs");

const writeContent = (obj, type, content, code = 200) => {
    obj.writeHead(code, { 'content-type': type });
    obj.write(content)
}

const types = {
    default: 'application/octet-stream',
    'js': 'application/javascript',
    'css': 'text/css',
    'png': 'image/png'
}

const resources = (fs.readdirSync(__dirname + '/web/static'));

const serv = http.createServer(async (request, response) => {

    //loading resources in the static folder
    if (resources.includes(((request.url).split("/")[((request.url).split("/")).length - 1]))) {
        let extension = (request.url).split('.')[1];
        let fileContents = fs.readFileSync(__dirname + request.url);

        writeContent(response, types[extension], fileContents);
        response.end();
    }

    // main page
    else if (request.url === '/') {
        let htmlContent = fs.readFileSync(__dirname + "/web/index.html");
        if (request.method === 'GET') {
            // LOAD PAGE
            writeContent(response, 'text/html', htmlContent);
            response.end();
        } else {
            response.write(JSON.stringify(chat.history));
            response.end();
        }
    }
    else if (request.url === '/send') {
        let user_message = '';
        let chat_response = '';

        await request.on('data', (input_data) => {
            user_message = input_data.toString();
        })

        chat_response = await chat.receive_message(user_message);

        response.write(chat_response);
        response.end();
    }
});

const chat = new (require("./app/chat"));

chat.url = "http://127.0.0.1:11434/api/chat";

serv.listen(8000); // 127.0.0.1:8000