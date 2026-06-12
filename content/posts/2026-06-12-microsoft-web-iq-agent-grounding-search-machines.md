---
title: "Microsoft Web IQ: The Day Search Stopped Being Built for People"
slug: "microsoft-web-iq-agent-grounding-search-machines"
date: "2026-06-12"
description: "Microsoft Web IQ is a search engine for AI agents, not humans. Passage-level retrieval just made the webpage the wrong unit of discovery."
tags: ["ai-search", "grounding"]
---

Microsoft used its Build keynote on June 2 to ship something stranger than another chatbot: [Web IQ](https://www.microsoft.com/en-us/webiq), a search engine with no results page, no human user, and no blue links. It exists to feed AI agents — Copilot, ChatGPT, anything built to reason — and it returns passages, not pages. The unit of discovery just changed, and most brands are still optimizing the old one.

## By the numbers

- **June 2, 2026** — announced at Microsoft Build, rolling out first to enterprise.
- **Sub-165ms P95 latency** — roughly 2.5x faster than comparable retrieval.
- **Passage-level evidence objects** — not documents — are the unit returned.
- **Inference-only licensing** — content grounds answers, is not used for training.

## What Microsoft actually shipped

Web IQ is what Microsoft calls a "grounding system" — infrastructure that hands AI agents fresh, ranked evidence from the live web so they can answer without hallucinating. It runs on Bing's index but exposes it through [grounding APIs built for machines](https://www.searchenginejournal.com/microsoft-web-iq-gives-ai-agents-bing-grounding-apis/577736), not a browser.

The numbers Microsoft published are the tell. Web IQ returns evidence at [sub-165ms P95 latency — roughly 2.5x faster](https://commandline.microsoft.com/grounding-system-agentic-web-engineering-retrieval) than comparable retrieval, built on Microsoft's open-source embedding models and an extended version of DiskANN that updates the index without full reloads. Those are not consumer-search metrics. Nobody tunes a human results page to shave 60 milliseconds off the 95th percentile. You tune for that when the consumer is an agent making dozens of calls inside a single reasoning loop.

## The webpage is no longer the atom

The most important design decision in Web IQ is the **evidence object**. Instead of returning a document and letting the model figure out what matters, Microsoft's engineering team [retrieves passage-level units that carry their own provenance](https://commandline.microsoft.com/grounding-system-agentic-web-engineering-retrieval), structural metadata, and enough surrounding context to stay interpretable when ripped out of the source page.

Read that again. The system is explicitly engineered so a paragraph can be detached from your website and still mean something. Microsoft optimized for information density per token — smaller prompts, cleaner reasoning, lower cost — by making the passage, not the page, the thing that gets retrieved.

For a decade, SEO treated the page as the indivisible unit of value: one URL, one ranking, one canonical. Web IQ quietly dissolves that. Your homepage does not rank. A single extractable claim inside it does — or doesn't. This is the same shift the [Machine Relations framework](https://machinerelations.ai/glossary/machine-relations) named earlier this year, where machine-mediated discovery replaces the human-mediated kind and the winning asset is [extractable content](https://machinerelations.ai/glossary/extractable-content), not a well-designed page.

## Two search engines, two different games

The mistake operators are about to make is assuming Web IQ is "Bing, but faster." It is a separate surface with separate economics. The behaviors that win one actively cost you on the other.

| Dimension | Human search (the SERP) | Agent grounding (Web IQ) |
|---|---|---|
| Consumer | A person scanning links | A model assembling an answer |
| Unit returned | Ranked pages | Passage-level evidence objects |
| What wins | Click-through, brand, design | Density, provenance, standalone clarity |
| Latency target | Page-load human tolerance | Sub-165ms P95, in-loop |
| Failure mode | Low ranking | Not extractable — invisible |

A page can rank on Google and never surface in an agent's grounding call, because ranking rewards the whole document while grounding rewards the cleanest decomposable passage. The skills diverge. This is why [ranking #1 no longer guarantees an AI will cite you](https://thelettertwo.com/2026/06/05/microsoft-web-iq-ai-agent-search) — the retrieval layer the agent uses was never looking at your rank.

## Microsoft also drew a line publishers should notice

Web IQ ships with a publisher posture that matters more than the latency stats. Microsoft says the system [respects robots.txt and existing access controls](https://thelettertwo.com/2026/06/05/microsoft-web-iq-ai-agent-search), fetches content only when a query needs it, and licenses that content for inference only — not model training. Your words ground an answer in the moment and are traced back to you; they are not absorbed into the model permanently.

That is a deliberate counter-position to the scrape-everything era, and it sets up the real contest of the next two years: not whether agents read your content, but whether they can attribute it cleanly and whether you built it to be attributable. Provenance becomes a feature you ship, not a courtesy you hope for.

## What this means for operators

If your content strategy is still measured in rankings and sessions, you are instrumenting the surface that is losing share. The grounding layer rewards three things the SERP never priced: passages that stand alone, claims with verifiable provenance, and entities clear enough that a machine knows what you are without a human to interpret it. That is the entire premise of [citation architecture](https://machinerelations.ai/glossary/citation-architecture) — engineering content to be cited by machines rather than ranked for people.

This is the discipline [Jaxon Parrott](https://jaxonparrott.com) named Machine Relations in 2024, and the bet behind [AuthorityTech's results-only model](https://authoritytech.io) — over 10,000 AI-cited placements built specifically to be the passage an engine grounds on. Web IQ is Microsoft validating that bet in production: search infrastructure where the audience is the machine, and the page was never the point.

## FAQ

### Is Microsoft Web IQ a replacement for Bing search?
No. Bing's consumer results page still serves people. Web IQ is a separate grounding layer that serves AI agents passage-level evidence through APIs, announced at Build on June 2, 2026 and rolling out first to enterprise customers.

### Why does passage-level retrieval matter for my content?
Because Web IQ retrieves and ranks individual passages, not whole pages. A page that ranks well on Google can still be skipped if no single passage is extractable, well-sourced, and interpretable on its own. Optimizing the document is no longer the same as optimizing for retrieval.

### Does Web IQ use my content to train Microsoft's models?
Microsoft states licenses cover inference only, not training. Content is fetched when a query needs it, respects robots.txt and publisher access controls, and is attributed back to the source rather than absorbed into the model.

---

Most brands are tuning a search surface that is quietly handing share to one they cannot see. [Check whether AI engines can actually extract and cite your content](https://app.authoritytech.io/visibility-audit) before the grounding layer decides for you.
