(() => {
    const prefix = "comets-add-custom-buttons";
    const textsKey = `${prefix}-texts`;

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

    function reloadSettingsPanel() {
        const panel = document.getElementById(`${prefix}-settings-panel`);
        panel.innerText = "";
        panel.appendChild(createElementFromHtml("<h4>カスタムボタンの管理（再読み込みで反映されます）</h4>"));

        const input = createElementFromHtml('<input type="text" id="add-input-text" placeholder="追加するテキスト"></input>');
        const addButton = createElementFromHtml('<button class="btn btn-primary">追加</button>');
        addButton.addEventListener("click", () => {
            const input = document.getElementById("add-input-text");
            addText(input.value);
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
                reloadSettingsPanel();
            }, false);
            const label = createElementFromHtml(`<span> ${texts[i]}</span>`);
            div.appendChild(removeButton);
            div.appendChild(label);
            panel.appendChild(div);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const root = document.getElementById("js_comment");
        const div = createElementFromHtml(`<div id="${prefix}-area"></div>`);
        div.appendChild(createElementFromHtml("<h3>カスタムボタン</h3>"));

        const buttons = createElementFromHtml(`<div id="${prefix}-buttons"></div>`);
        const texts = loadTexts();
        for(const text of texts) {
            buttons.appendChild(createElementFromHtml(`<button class="btn btn-primary js_btn">${text}</button>`));
            buttons.appendChild(createElementFromHtml("<span> </span>")); // hack for spacing
        }
        div.appendChild(buttons);

        const settingsPanel = createElementFromHtml(`<div id="${prefix}-settings-panel"></div>`);
        div.appendChild(settingsPanel);
        root.appendChild(div);

        reloadSettingsPanel();
    }, false);
})();
