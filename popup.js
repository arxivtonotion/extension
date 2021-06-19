const getCurrentTabURL = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.url;
};

const bind_arxiv_button = async () => {
    document
        .getElementById("arxiv_button")
        .addEventListener("click", async () => {
            const url = await getCurrentTabURL();
            try {
                const metadata = await getMetadataFromArxivURL(url);
                console.log(metadata);

                let n = new Notion();
                const token = await n.authToken()
				console.log(token)
            } catch (e) {
                alert(e);
            }
        });
};

const bind_notion_button = () => {
    document
        .getElementById("notion_auth_button")
        .addEventListener("click", function () {
            var newURL =
                "https://api.notion.com/v1/oauth/authorize?client_id=951744be-9fe3-4fc4-9901-7877db5a67f0&redirect_uri=https%3A%2F%2Farxivtonotion.github.io%2F&response_type=code";
            chrome.tabs.create({ url: newURL });
        });
};

document.addEventListener("DOMContentLoaded", () => {
    bind_arxiv_button();
    bind_notion_button();
});
