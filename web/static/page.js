function hexToAscii(Hex) {
    let table = {
        'A': 10,
        'B': 11,
        'C': 12,
        'D': 13,
        'E': 14,
        'F': 15
    };

    let number = 0;
    let iteration = 1;

    (Hex.split('')).forEach(char => {
        if ((Object.keys(table).join()).includes(char)) {
            number += (16 ** iteration) * table[char];
        } else {
            number += (16 ** iteration) * char;
        }
        iteration -= 1;
    });

    return number;
}

function decodeString(str) {
    if (str.includes("%")) {
        str = str.split('%');
        for (let a = 0; a < str.length; a++) {
            if (a != 0 || str[a].length == 2) {
                if (str[a].length > 2) {
                    str[a] = String.fromCharCode(hexToAscii((str[a].slice(0, 2)))) + str[a].slice(2, str[a].length);
                } else if (str[a].length == 2) {

                    str[a] = String.fromCharCode(hexToAscii(str[a]));
                }
            }
        }
        str = str.join('');
    }
    return str;
}

//note: probably should use textarea instead of input for multi input and it's easier
$(() => {
    const message_format = `<div class="UserMessage">
<p class="Name">{{Title}}</p>
<p class="MessageBox">{{Message}}</p>
</div>`;
    let container = document.querySelector(".Container");

    this.onload = function () {
        $.ajax({
            type: 'POST', url: '/', data: "datastring", dataType: "text", success: (response) => {

                JSON.parse(response).forEach(msg => {
                    let [box, user, content] = [message_format, msg['role'], msg['content']];
                    if (user === "user") user = "You";
                    box = (box.replace('{{Title}}', `${user}`)).replace('{{Message}}', content);
                    container.innerHTML += box;
                });
            }
        });
    }

    $('form').validate();
    $('form').on('submit', function (e) {
        e.preventDefault();
        let datastring = ($(this).serialize()).split("=")[1];
        let user = msgbox = message_format;

        datastring = decodeString("%20" + datastring); // re-format encoded ascii characters

        // Push the user's message into the chat
        container.innerHTML += (user.replace('{{Title}}', 'You')).replace('{{Message}}', datastring);

        document.querySelector('.input').value = '';

        $.ajax({
            type: 'POST', url: '/send', data: datastring, dataType: "text", success: (response) => {
                // Push the Assistant's message into the chat
                msgbox = (msgbox.replace('{{Title}}', 'Assistant')).replace('{{Message}}', response);
                container.innerHTML += msgbox;

                let _el = container.lastChild.childNodes[3];
                let txt = _el.innerText;

                _el.innerText = '';

                for (let a = 0; a < txt.length; a++) {
                    setTimeout(() => {
                        _el.innerHTML += txt[a];
                    }, 10 + 10 * a);
                }
            }
        });
    })
});