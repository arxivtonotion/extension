const getMetadataFromArxivURL = async (url) => {
    const id = parseIDFromArxivURL(url);
    const xml = await getXMLFromID(id);
    const metadata = getMetadataFromXML(xml);
    return metadata;
};

const parseIDFromArxivURL = (url) => {
    const u = new URL(url);
    if (u.origin == "https://arxiv.org") {
        const pathname_split = u.pathname.split("/");
        if (pathname_split.length == 3) {
            if (pathname_split[1] == "pdf") {
                return pathname_split[2].split(".pdf")[0];
            } else if (pathname_split[1] == "abs") {
                return pathname_split[2];
            } else {
                throw Error("not a valid paper link");
            }
        } else {
            throw Error("not a valid paper link");
        }
    } else {
        throw Error("not an arXiv link");
    }
};

const getXMLFromID = async (paper_id) => {
    const url = `http://export.arxiv.org/api/query?id_list=${paper_id}`;
    const resp = await fetch(url);
    const str = await resp.text();
    const data = new window.DOMParser().parseFromString(str, "text/xml");
    return data;
};

const getMetadataFromXML = (xml) => {
    const entries = [...xml.getElementsByTagName("entry")[0].children];
    let metadata = {
        authors: [],
        categories: [],
    };

    entries.forEach((entry) => {
        switch (entry.tagName) {
            case "id":
                metadata["paper_link"] = entry.innerHTML;
                break;
            case "updated":
                metadata["updated_date"] = entry.innerHTML;
                break;
            case "published":
                metadata["published_date"] = entry.innerHTML;
                break;
            case "title":
                metadata["title"] = entry.innerHTML;
                break;
            case "summary":
                metadata["abstract"] = entry.innerHTML;
                break;
            case "author":
                metadata["authors"].push(entry.children[0].innerHTML);
                break;
            case "link":
                if (entry.attributes.title != undefined) {
                    if (entry.attributes.title.value == "pdf") {
                        metadata["pdf_link"] = entry.attributes.href.value;
                    }
                }
                break;
            case "arxiv:primary_category":
                metadata["primary_category"] = entry.attributes.term.value;
                break;
            case "category":
                metadata["categories"].push(entry.attributes.term.value);
                break;
        }
    });

    return metadata;
};
