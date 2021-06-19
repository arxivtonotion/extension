class Notion {
    async authToken() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get("access_token", (token) => {
                if (Object.keys(token).length === 0) reject("no auth token");
                else {
                    resolve(token);
                }
            });
        });
    }

    async searchDatabases(token) {
    	
    }
}

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
