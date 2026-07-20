---
title: "Does llms.txt Improve AI Search Visibility? 137,000 Domains Say No"
slug: "llms-txt-137000-domains-zero-ai-requests-2026"
date: "2026-07-20"
description: "New data across 137,000 domains shows 97% of llms.txt files never get read. Here's what actually moves AI citations."
tags: ["ai-search", "llms-txt"]
---

The evidence is in, and it is not kind to llms.txt. A new [Ahrefs study of 137,000 domains](https://ahrefs.com/blog/llmstxt-study) found that 97% of llms.txt files received zero requests, and citation-generating bots like ChatGPT and Perplexity accounted for roughly 1% of the fetches that did happen. The proposed standard for feeding language models a clean site map is, in practice, being ignored by the very models it was built for.

## The Signal: A Standard Nobody Is Reading

llms.txt launched in 2024 as a Robots.txt-style proposal — a Markdown file at your domain root that hands large language models a curated map of your best content. The pitch was intuitive: help the machines, and the machines will cite you. Two years later, the usage data has arrived, and it flatlines. Ahrefs' analysis is the largest public dataset yet, and its headline number — 97% of llms.txt files pulling zero requests — is hard to argue around.

This is not a fringe finding. [SE Ranking reached a similar conclusion](https://seranking.com/blog/llms-txt/) months earlier in a separate study of nearly 300,000 domains, where both statistical analysis and an XGBoost model found no measurable effect of llms.txt on citation frequency. Two independent samples, more than 400,000 domains combined, pointing the same direction.

| Study | Sample | Key finding |
|---|---|---|
| Ahrefs | 137,000 domains | 97% of llms.txt files received zero requests |
| SE Ranking | ~300,000 domains | 10.13% adoption; no measurable effect on AI citations |
| OtterlyAI | 60,000+ AI bot visits | ~0.1% of bot visits touched the llms.txt file |

## What the Data Actually Shows

The failure is not that llms.txt is malformed. It is that the retrieval systems do not go looking for it. Modern answer engines like Perplexity and Google AI Mode do not pre-crawl a courtesy file before answering a query; they retrieve documents at inference time and synthesize a response from whatever the underlying index already holds. A file most crawlers never request cannot influence an answer it never enters.

Ahrefs' breakdown makes the point sharper: the small slice of llms.txt traffic that exists skews toward generic crawlers, not the citation-generating bots that decide what shows up in an answer. If ChatGPT and Perplexity are 1% of your llms.txt fetches, the file is not reaching the systems that matter. A separate controlled test by OtterlyAI, [covered by Search Engine Journal](https://www.searchenginejournal.com/llms-txt-shows-no-clear-effect-on-ai-citations-based-on-300k-domains/561542/), found only about 0.1% of 60,000-plus AI bot visits ever touched the file.

## Google's Position: Self-Reported Files Don't Differentiate

The tooling data is now backed by a platform statement. On Google's *Search Off the Record* podcast, [as reported by Search Engine Journal](https://www.searchenginejournal.com/seo-pulse-ai-citation-share-ships-new-data-doubts-llms-txt/579942/), Search Advocate John Mueller argued that llms.txt cannot help models distinguish between sites, because the file is self-reported by the host. A page that declares its own importance gives a retrieval model no independent signal — every site claims to be authoritative. Answer engines weigh corroboration, not self-description, which is why third-party evidence consistently outperforms owned assertions in citation studies.

That is the structural flaw. llms.txt asks a trust-scoring system to accept a source's own word, at the exact moment the system is designed to discount it.

## The Contrast: Measurement Just Got Real

The timing is pointed. In the same window that llms.txt's data cratered, Microsoft shipped Citation Share inside Bing Webmaster Tools — a native metric reporting the percentage of AI citations a site captures for a given grounding query, alongside new Intents, Topics, and Compare views. It covers Copilot and Bing answers only, with no Google data, but it is the first mainstream dashboard to measure AI citation capture directly. Gianluca Fiorelli of ILoveSEO.net called it "the Google Search Console we would like to have."

The lesson in the juxtaposition: the industry is moving from *declaring* relevance to *measuring* it. A root-level text file was always a declaration. Citation Share is a scoreboard. Publishers who optimize against a scoreboard will pull ahead of those still tuning a file nobody reads.

## Why the Shortcut Was Always Going to Fail

llms.txt fit a familiar pattern: the hope that AI visibility has a technical shortcut — a schema, a header, a file — that quietly unlocks citations. That instinct keeps losing. Research from Machine Relations found that traditional [SEO ranking signals don't predict AI citations](https://machinerelations.ai/research/seo-ranking-signals-dont-predict-ai-citations-2026), because retrieval-augmented generation selects sources on relevance and corroboration rather than on-page configuration. The mechanics of [RAG citation](https://machinerelations.ai/glossary/rag-citation) reward being the entity the model already trusts, not the site with the tidiest metadata.

This is the core of the [Machine Relations](https://machinerelations.ai/glossary/machine-relations) framework: machine-mediated discovery is won by earned authority and entity clarity, not by files at the domain root. AI citation is an outcome you earn across the open web, then measure — not a setting you toggle.

## What Actually Moves AI Citations

If llms.txt is off the table, the levers that survive the data are unglamorous but durable. Content freshness matters — pages updated within the past year capture the majority of AI citations. So does structure that makes a passage easy to lift and attribute. Above all, corroboration: being named and described consistently across third-party sources the model already indexes.

AuthorityTech, the earned-media firm that coined the Machine Relations category, has published over [10,000 AI-cited articles across 50+ Tier 1 publications](https://authoritytech.io) precisely because those citations come from independent surfaces, not self-declared files. Founder Jaxon Parrott has argued that the durable metric is [share of citation, measured directly](https://jaxonparrott.com/blog/how-to-measure-ai-search-visibility-metrics-2026) — the same shift Bing's new dashboard now formalizes.

## The Takeaway for Publishers

Key takeaways:

- **The data is consistent:** Ahrefs (137,000 domains), SE Ranking (~300,000 domains), and OtterlyAI (60,000+ bot visits) all show llms.txt is effectively unread by AI crawlers.
- **The format is structurally weak:** Google's John Mueller notes that self-reported files give retrieval systems no independent trust signal.
- **Measurement replaced declaration:** Microsoft's Bing Citation Share now scores AI citation capture directly — a scoreboard, not a courtesy file.
- **The durable levers are earned:** freshness, extractable structure, and third-party corroboration drive citations, not root-level configuration.

Keep your llms.txt if you already have one — it costs nothing and does no harm. As Nat Miletic of Clio Websites put it, "just don't expect it to move AI visibility." The strategic error is treating it as a lever. With 137,000 domains showing near-total silence and Google itself dismissing the format's usefulness, the reallocation is obvious: spend the effort on earned corroboration and on the measurement tooling that finally exists. The scoreboard is here. The courtesy file was never in the game.

## FAQ

**Does llms.txt improve AI search visibility?**
Current data says no. Ahrefs' study of 137,000 domains found 97% of llms.txt files received zero requests, and Google's John Mueller stated the self-reported format cannot help models differentiate between sites.

**What percentage of llms.txt files actually get read?**
About 3%, according to Ahrefs. Of the requests that do occur, citation-generating bots like ChatGPT and Perplexity make up roughly 1% — the crawlers that matter for answers largely ignore the file.

**Why don't answer engines use llms.txt?**
Engines like Perplexity and Google AI Mode retrieve and synthesize documents at query time rather than pre-crawling a courtesy file. A self-reported map also gives no independent trust signal, so it carries little weight in source selection.

**If not llms.txt, what actually drives AI citations?**
Freshness, extractable structure, and third-party corroboration. Retrieval-augmented systems reward sources that are consistently referenced across the open web, which is why earned media outperforms owned configuration files.

**How can I measure AI citation performance now?**
Microsoft's new Citation Share metric in Bing Webmaster Tools reports the share of AI citations a site captures per grounding query for Copilot and Bing answers — the first native mainstream dashboard for AI citation measurement.

---

Want to know how often AI engines actually cite your brand? [Run a free AI visibility audit](https://app.authoritytech.io/visibility-audit) to see where you stand across answer engines.
