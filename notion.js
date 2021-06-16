document.getElementById("notion_auth_button").addEventListener('click', function () {
    var newURL = "https://api.notion.com/v1/oauth/authorize?client_id=951744be-9fe3-4fc4-9901-7877db5a67f0&redirect_uri=https%3A%2F%2Fpriyansi.github.io%2Farxivtonotion.github.io%2F&response_type=code";
    chrome.tabs.create({ url: newURL });
});

// import { Client } from "@notionhq/client"

// const notion = new Client({ auth: process.env.NOTION_KEY })

// const databaseId = process.env.NOTION_DATABASE_ID

// async function addItem(text) {
//     try {
//         await notion.request({
//             path: "pages",
//             method: "POST",
//             body: {
//                 parent: { database_id: databaseId },
//                 properties: {
//                     title: {
//                         title: [
//                             {
//                                 "text": {
//                                     "content": text
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             },
//         })
//         console.log("Success! Entry added.")
//     } catch (error) {
//         console.error(error.body)
//     }
// }

// addItem("Yurts in Big Sur, California")