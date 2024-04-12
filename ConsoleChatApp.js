const console_input = require('node:readline');
const consl = console_input.createInterface({ input: process.stdin, output: process.stdout });


const chat = (new (require("./app/chat")));
chat.url = "http://127.0.0.1:11434/api/chat";  //llama2 running through Ollama

(async function main() {
        consl.question('User: ', async (input) => {
            let out = await chat.receive_message(input);
    
            await new Promise((r) => {
                process.stdout.write("Assistant: ");
                for(let a = 0; a < out.length; a++)
                {
                    setTimeout(()=>{
                        process.stdout.write(out[a]);
                        (a+1) == out.length ? (()=>
                        {
                            process.stdout.write('\n');
                            r();
                        })() : null;
    
                    },50+50*a);
                }});
    
        main();
        });
    })();