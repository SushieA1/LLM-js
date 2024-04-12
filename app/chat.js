const fetch = require('node-fetch');
const historyFile = require('./history.json');
const config = require('./config.json');
const fs = require('fs');

class chat {
  constructor() {
    //this.totalTokens = 0;
    this.body = config;
    this.history = historyFile;
    this.url = 'http://localhost:1234/v1/chat/completions'; //default for LM Studio
    
    (async () => {
      await this.initialize();
    })();
  }

  reset_history() {
    try { fs.writeFileSync(__dirname + '/history.json', JSON.stringify([])); } catch (e) { console.error(e); }
  }

  create_header(role = 'user', content = ' ') {
    return { 'role': `${role}`, 'content': `${content}` }
  }

  async initialize() {
    let messagesBody = this.body['messages'];

    // load system prompt first
    await new Promise((resolve) => {
      if (messagesBody[0]['content'] == "") {
        try { this.body['messages'][0]['content'] = fs.readFileSync(__dirname + "/prompt.txt", 'utf8'); } catch (e) { console.log(`FAILED TO INITIALIZE HISTORY \n\n${e}`); }
      }
      resolve();
    });

    // loading chat history
    return new Promise((resolve) => {
      let m = historyFile.length;
      for (let a = 0; a < m; a++) {
        this.body['messages'].push(historyFile[a]); // loading chat history into the post request body
      }
      resolve();
    });
  }

  // receives the assistant's message using the post request method
  async receive_message(_message = " ") {
    try {
      let post = await this.post_request(_message);

      return post[1]['content'];
    } catch (e) {
      if(e.message.includes(`request to ${this.url}`)) {
         console.error(`COULD NOT REACH THE SERVER, MAKE SURE THE URL IS VALID AND THE SERVER IS WORKING`);
      }
      return " ";
    }
  }

  async post_request(_message = " ") {
    this.body['messages'].push(this.create_header('user', _message));
    let postResponse = await fetch(this.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.body) });

    if (postResponse.status == 200) {
      postResponse = await postResponse.json();
      let reason, responseMessage;

      try { //LMStudio, OPENAI format
        reason = postResponse["choices"][0]["finish_reason"];
        responseMessage = postResponse["choices"][0]["message"];
      } catch {
        try { //Ollama format
          reason = postResponse["done"];
          responseMessage = postResponse["message"];
        } catch {
          console.error("Could not evaluate response");
          return [this.create_header('user', _message), this.create_header('assistant', "EMPTY")];
        }
      }

      if (reason == true || reason == "stop") {

        if (responseMessage['content'] == '' || responseMessage['content'] == undefined) {
          return [this.create_header('user', _message), this.create_header('assistant', "EMPTY")];
        }
          //this.totalTokens += parseInt(postResponse["usage"]["completion_tokens"]);
          this.body['messages'].push(responseMessage);

          historyFile.push(this.create_header('user', _message));
          historyFile.push(responseMessage);

          fs.writeFileSync(__dirname + '/history.json', JSON.stringify(historyFile));

          return [this.create_header('user', _message), responseMessage]
      }

    } else { //error code 400
      let ERROR = (JSON.parse((new TextDecoder()).decode(await postResponse.body.read())))['error'];
      console.error(`REQUEST FAILED`);

      if (ERROR = "<LM Studio error> Unknown exception during inferencing.. Error Data: n/a, Additional Data: n/a") {
        console.error(`Maximum tokens exceeded\n${ERROR}`);
        return [this.create_header('user', _message), this.create_header('assistant', "Max tokens exceeded")];
      }
        return [this.create_header('user', _message), this.create_header('assistant', "EMPTY")];
    }
  }
}

module.exports = chat;