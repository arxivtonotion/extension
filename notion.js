// Notion API abstraction
class Notion {
    async init() {
        try {
            this.authToken = await this.getAuthTokenFromStorage();
            this.databases = await this.getDatabases(this.authToken);
        } catch (err) {
            throw err;
        }
    }

    async getAuthTokenFromStorage() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get("access_token", (token) => {
                if (Object.keys(token).length === 0) reject("no auth token found in storage");
                else {
                    resolve(token["access_token"]);
                }
            });
        });
    }

    async getDatabases(token) {
        const response = await fetch("https://arxivtonotion.herokuapp.com/v1/search/", {
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Notion-Version": "2021-05-13",
            }),
            body: {
                query: "",
                sort: {
                    direction: "ascending",
                    timestamp: "last_edited_time",
                },
            },
        }).catch((err) => console.log(err));

        const searchResultData = await response.json();
        let databases = searchResultData["results"].filter((x) => x["object"] === "database");

        return databases;
    }

    getDatabaseProperties(database) {
        let databaseProperties = {};

        databaseProperties["id"] = database["id"];
        databaseProperties["created_time"] = database["created_time"];
        databaseProperties["last_edited_time"] = database["last_edited_time"];
        databaseProperties["properties"] = {};

        for (let key in database["properties"]) {
            databaseProperties["properties"][key] = {
                id: database["properties"][key]["id"],
                type: database["properties"][key]["type"],
            };
        }

        return databaseProperties;
    }

    async writePaperMetadataToDatabase(databaseProperties, metadata, token) {
        let requestBody = {
            parent: {
                database_id: databaseProperties["id"],
            },
            properties: {},
            children: [],
        };

        requestBody["children"] = [
            {
                object: "block",
                type: "paragraph",
                paragraph: {
                    text: [
                        {
                            type: "text",
                            text: {
                                content: metadata["authors"].join(", "),
                            },
                        },
                    ],
                },
            },
            {
                object: "block",
                type: "heading_3",
                heading_3: {
                    text: [{ type: "text", text: { content: "Abstract" } }],
                },
            },
            {
                object: "block",
                type: "paragraph",
                paragraph: {
                    text: [
                        {
                            type: "text",
                            text: {
                                content: metadata["abstract"],
                            },
                        },
                    ],
                },
            },
        ];

        for (let key in databaseProperties["properties"]) {
            requestBody["properties"][key] = {
                ...databaseProperties["properties"][key],
            };

            switch (key) {
                case "PDF Link":
                    requestBody["properties"][key]["url"] = metadata["pdf_link"];
                    break;
                case "Primary Category":
                    requestBody["properties"][key]["select"] = {
                        name: metadata["primary_category"],
                    };
                    break;
                case "Published Date":
                    requestBody["properties"][key]["date"] = {
                        start: metadata["published_date"],
                    };
                    break;
                case "Updated Date":
                    requestBody["properties"][key]["date"] = {
                        start: metadata["updated_date"],
                    };
                    break;
                case "Paper Link":
                    requestBody["properties"][key]["url"] = metadata["paper_link"];
                    break;
                case "Categories":
                    requestBody["properties"][key]["multi_select"] = metadata["categories"].map((x) => {
                        return { name: x };
                    });
                    break;
                case "Title":
                    requestBody["properties"][key]["title"] = [
                        {
                            text: {
                                content: metadata["title"],
                            },
                        },
                    ];
                    break;
            }
        }

        await fetch("https://arxivtonotion.herokuapp.com/v1/pages", {
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
                "Notion-Version": "2021-05-13",
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(requestBody),
        }).catch((err) => console.log(err));
    }
}
