async function getCurrentTabURL() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.url;
}

add_click_bind = async () => {
    document.getElementById("arxiv_button").addEventListener("click", async () => {
        console.log(await getCurrentTabURL())
    });
};

document.addEventListener("DOMContentLoaded", () => {
    add_click_bind();
});
