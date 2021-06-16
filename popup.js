async function getCurrentTabURL() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.url;
}

add_click_bind = async () => {
    document.getElementById("arxiv_button").addEventListener("click", async () => {
        const url = await getCurrentTabURL()
		try {
			const metadata = await getMetadataFromArxivURL(url)
		} catch (e) {
			alert(e)
		}
    });
};

document.addEventListener("DOMContentLoaded", () => {
    add_click_bind();
});
