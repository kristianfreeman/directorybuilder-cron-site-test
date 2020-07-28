const fetch = require("node-fetch");
const { TOKEN, API_URL } = process.env;

const path = "/okcomputer";

if (!TOKEN) {
  throw new Error("No TOKEN env var provided");
}

if (!API_URL) {
  throw new Error("No API_URL env var provided");
}

const getSites = async () => {
  const resp = await fetch(API_URL, {
    headers: { Authorization: `Token ${TOKEN}` },
  });
  return await resp.json();
};

const getSiteHealth = async ({ domain }) => {
  const url = new URL(`https://${domain}/${path}`);
  const resp = await fetch(url);
  return resp.status == 200;
};

const checkSite = async (site) => {
  const ok = await getSiteHealth(site);
  if (ok) {
    console.log(`${site.domain} OK`);
  } else {
    throw new Error(`Unable to reach site ${site.domain}`);
  }
};

const main = async () => {
  const sites = await getSites();
  checkSite({ domain: "directorybuilder.app" });
  sites.forEach(checkSite);
};

main();
