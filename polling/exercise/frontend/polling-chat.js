const chat = /** @type {HTMLFormElement} */ (document.getElementById("chat"));
const msgs = document.getElementById("msgs");

// let's store all current messages here
/** @type {import("../../../common/types.js").Message[]} */
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
    e.preventDefault();
    const elements =
        /** @type {import("../../../common/types.d.ts").MessageForm} */ (
            chat.elements
        );
    postNewMsg(elements.user.value, elements.text.value);
    elements.text.value = "";
});

/**
 * @param {string} user
 * @param {string} text
 */
async function postNewMsg(user, text) {
    const newMsg = {
        user,
        text,
    };

    return fetch("/poll", {
        method: "POST",
        body: JSON.stringify(newMsg),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

async function getNewMsgs() {
    /** @type {import("../../../common/types.js").GetMessages} */
    let json;
    try {
        const res = await fetch("/poll");
        json = await res.json();
    } catch (err) {
        console.error("polling error", err);
    }

    allChat = json.msg;
    render();

    setTimeout(getNewMsgs, INTERVAL);
}

function render() {
    // as long as allChat is holding all current messages, this will render them
    // into the ui. yes, it's inefficent. yes, it's fine for this example
    const html = allChat.map(({ user, text }) => template(user, text));
    msgs.innerHTML = html.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
/**
 * @param {string} user
 * @param {string} msg
 */
const template = (user, msg) =>
    `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// make the first request
getNewMsgs();
