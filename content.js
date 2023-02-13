(() => {
    const prefix = "comets-add-custom-buttons";
    const textsKey = `${prefix}-texts`;
    const submitButtonId = `${prefix}-invisible-submit-button`;
    const settingsPanelId = `${prefix}-settings-panel`;
    const buttonsPanelId = `${prefix}-buttons`;

    function createElementFromHtml(html) {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.firstElementChild;
    }

    function loadTexts() {
        const val = JSON.parse(localStorage.getItem(textsKey));
        if(val && val.data) {
            return val.data;
        } else {
            return [];
        }
    }

    function addText(text) {
        if(text) {
            const texts = loadTexts();
            texts.push(text);
            localStorage.setItem(textsKey, JSON.stringify({ data: texts }));
        }
    }

    function removeText(index) {
        const texts = loadTexts();
        texts.splice(index, 1);
        localStorage.setItem(textsKey, JSON.stringify({ data: texts }));
    }

    function sendText(text) {
        if (typeof text !== "string") return;

        const submitButton = document.getElementById(submitButtonId);
        submitButton.innerText = text;
        submitButton.click();
    }

    function reloadSettingsPanel() {
        const panel = document.getElementById(settingsPanelId);
        panel.innerText = "";
        panel.appendChild(createElementFromHtml("<h4>カスタムボタンの管理</h4>"));

        const input = createElementFromHtml('<input type="text" id="add-input-text" placeholder="追加するテキスト"></input>');
        const addButton = createElementFromHtml('<button class="btn btn-primary">追加</button>');
        addButton.addEventListener("click", () => {
            const input = document.getElementById("add-input-text");
            addText(input.value);
            reloadButtonsPanel();
            reloadSettingsPanel();
        }, false);
        panel.appendChild(input);
        panel.appendChild(createElementFromHtml("<span> </span>")); // hack for spacing
        panel.appendChild(addButton);

        const texts = loadTexts();
        for(const i in texts) {
            const div = document.createElement("div");
            const removeButton = createElementFromHtml('<button class="btn btn-primary">削除</button>');
            removeButton.addEventListener("click", () => {
                removeText(i);
                reloadButtonsPanel();
                reloadSettingsPanel();
            }, false);
            const label = createElementFromHtml(`<span> ${texts[i]}</span>`);
            div.appendChild(removeButton);
            div.appendChild(label);
            panel.appendChild(div);
        }
    }

    function reloadButtonsPanel() {
        const panel = document.getElementById(buttonsPanelId);
        panel.innerText = "";

        const texts = loadTexts();
        for(const text of texts) {
            const button = createElementFromHtml(`<button class="btn btn-primary">${text}</button>`);
            button.addEventListener("click", () => {
                sendText(text);
            }, false);

            panel.appendChild(button);
            panel.appendChild(createElementFromHtml("<span> </span>")); // hack for spacing
        }
    }

    function setupEnterKeyTextSubmit() {
        const inputField = document.getElementById("js_inputText");
        const submitButton = document.getElementById("js_submitBtn");

        let composing = false;
        inputField.addEventListener("compositionstart", () => composing = true, false);
        inputField.addEventListener("compositionend", () => composing = false, false);
        inputField.addEventListener("keypress", e => {
            if (e.key !== "Enter") return;
            if (composing) return;
            submitButton.click();
        }, false);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const root = document.getElementById("js_comment");
        const div = createElementFromHtml(`<div id="${prefix}-area"></div>`);
        div.appendChild(createElementFromHtml("<h3>カスタムボタン</h3>"));
        div.appendChild(createElementFromHtml(`<button id="${submitButtonId}" style="display: none" class="js_btn">`));
        div.appendChild(createElementFromHtml(`<div id="${buttonsPanelId}"></div>`));
        div.appendChild(createElementFromHtml(`<div id="${settingsPanelId}"></div>`));
        root.appendChild(div);

        reloadButtonsPanel();
        reloadSettingsPanel();
        setupEnterKeyTextSubmit();
    }, false);
})();
