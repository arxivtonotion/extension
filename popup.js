// Entrypoint file. Runs first when the extension is clicked

const getCurrentTabURL = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.url;
};

const bind_add_paper_to_notion_button = async (notionInstance) => {
    document.getElementById("arxiv_button").addEventListener("click", async () => {
        const url = await getCurrentTabURL();
        try {
            document.getElementById("arxiv_button").classList.add("is-loading");

            const metadata = await getMetadataFromArxivURL(url);
            const token = notionInstance.authToken;
            const databases = notionInstance.databases;
            const selectedDatabaseName = document.getElementById("databases_select").value;

            let selectedDatabase = databases[0];
            for (const db of databases) {
                console.log(db);
                if (db["title"][0]["plain_text"] == selectedDatabaseName) {
                    selectedDatabase = db;
                    break;
                }
            }

            console.log(token, metadata, databases);

            const properties = notionInstance.getDatabaseProperties(selectedDatabase);
            await notionInstance.writePaperMetadataToDatabase(properties, metadata, token);

            document.getElementById("arxiv_button").classList.remove("is-loading");
            document.getElementById("arxiv_button").innerHTML = '<i class="fas fa-check-circle"></i>';
            setTimeout(() => {
                document.getElementById("arxiv_button").innerHTML = "Add Paper";
            }, 700);
        } catch (e) {
            console.log(e);
            window.alert("This page is not an arxiv page");
        }
    });
};

const bind_authenticate_notion_button = () => {
    document.getElementById("notion_auth_button").addEventListener("click", function () {
        var newURL =
            "https://api.notion.com/v1/oauth/authorize?client_id=951744be-9fe3-4fc4-9901-7877db5a67f0&redirect_uri=https%3A%2F%2Farxivtonotion.github.io%2F&response_type=code";
        chrome.tabs.create({ url: newURL });
    });
};

document.addEventListener("DOMContentLoaded", async () => {
    bind_authenticate_notion_button();

    const url = await getCurrentTabURL();
    if (isArxivURL(url)) {
        document.getElementById("valid_arxiv_url_tag").style.display = "";
    } else {
        document.getElementById("invalid_arxiv_url_tag").style.display = "";
    }

    try {
        let n = new Notion();
        await n.init();
        document.getElementById("notion_authenticated_tag").style.display = "";
        document.getElementById("authenticating_loading_button").style.display = "none";
        bind_add_paper_to_notion_button(n);

        console.log(n.databases);

        let databasesSelect = document.getElementById("databases_select");
        databasesSelect.innerHTML = "";
        n.databases.forEach((db) => {
            let node = document.createElement("option");
            node.appendChild(document.createTextNode(db["title"][0]["plain_text"]));
            databasesSelect.appendChild(node);
        });
    } catch (err) {
        document.getElementById("notion_unauthenticated_tag").style.display = "";
    }
});
