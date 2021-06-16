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
            return pathname_split[2];
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

const getMetadataFromXML = (xml) => {};
