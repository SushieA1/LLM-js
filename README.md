# LM Studio & Ollama Node.js API Wrapper

## About:
This is a Node.js module that utilizes LM Studio's local server API & Ollama's local server API (and any API that behaves like OpenAI's API). This module is still **under development**.

## Purpose
The purpose of this module is to make running LLM's easier to manage and use, and save developers time by providing the necessary methods to operate the LLM (still in progress)

## Features 

- CLI chat sample [ConsoleChatApp.js]
- Web chat sample running on a local Nodejs server [WebServer.js]

## How to use
#### Reminder: before using this Module You must have Nodejs installed and a *running* LLM server (Eg. Ollama or LM Studio) 

1. Make sure you check app/config.json, and make sure to check configs folder and use the right config file for either Ollama format or other LLM format
2. Include the chat.js module via require from the /app folder
3. Change the url to the LLM's server's url (when needed) by changing the url property (chat.url)
4. Input the prompt for the LLM to use either by changing app/prompt.txt or in the config.json file
5. To send a message use chat.receive_message('Message here') that **returns** the LLM's response

## Basic sample code 
```javascript
const chat = (new (require("./app/chat"))); // importing the chat class

// You have to get the api url for your LLM
//chat.url = "http://127.0.0.1:11434/api/chat";  // llama2 running through Ollama
//chat.url = "http://localhost:1234/v1/chat/completions" // LM Studio (default value)
//chat.reset_history(); // In case you need to reset the history programmatically

// Must use an Async function in order to synchronize the methods
(async () => {
let input = "Message here";
let response = await chat.receive_message(input);

})();
```

## Current Issues
- For now, in case you get the error message "MAX TOKENS EXCEEDED" you will have to restart the server and do chat.reset_history() or just replace the history.json file's contents with [ ]
- This issue is due to not being able to detect the tokenizer of the model used (for now) and the Model's token context would exceed it's limit eventually (you can tweak the maximum tokens in LM Studio by changing "Context length" or n_ctx to a higher value

## Disclamer
I am still working on this project and many bugs are expected, please do send any bugs you encounter in the issues section.
If you have any suggestions / improvements you can also send it in the issues section.
