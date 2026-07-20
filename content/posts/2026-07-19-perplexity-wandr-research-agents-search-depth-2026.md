---
title: "Perplexity WANDR Benchmark: Research Agents Still Fail Evidence Depth"
date: "2026-07-19"
slug: "perplexity-wandr-research-agents-search-depth-2026"
description: "Perplexity WANDR shows AI research agents still fail at evidence depth, not just page discovery."
tags: ["ai-search", "ai-agents"]
primaryQuery: "Perplexity WANDR benchmark research agents"
researchBriefPath: "editorial/data/research-briefs/2026/07/19/paralax/perplexity-wandr-research-agents-search-depth-2026.json"
researchQualityScore: 2.5
---

Perplexity's WANDR benchmark changes the AI search conversation from "can an agent find a page?" to "can it build a complete, evidence-backed record at scale?" The answer, from Perplexity's own July 2026 release, is still mostly no: wide-and-deep research remains a retrieval-depth problem.

## Perplexity WANDR measures wide-and-deep research, not one-shot answers

[Perplexity Research describes WANDR](https://research.perplexity.ai/articles/wandr-benchmark-evaluating-research-agents-that-must-search-wide-and-deep) as an open benchmark and evaluation harness for "high-volume, evidence-heavy knowledge work." The release says WANDR contains 500 public task packages and asks systems to handle tasks such as competitive mapping, due diligence, literature review, market analysis, product comparison, and talent sourcing.

That matters because most AI search demos optimize for a single satisfying answer. WANDR asks for a broad collection of qualifying entities and then requires evidence for each record. Perplexity's [GitHub repository](https://github.com/perplexityai/wandr) defines the benchmark as "structured, high-volume information work" requiring broad discovery, enrichment, extraction, entity disambiguation, and evidence-backed answer synthesis.

The split is clean:

| Search task | What the agent must prove | Why it is harder |
|---|---|---|
| One-shot answer | Find a plausible source and answer the question | A partial result can still look useful |
| Wide research | Discover the full set of qualifying items | Missing entities hurt recall |
| Deep research | Attach complete evidence to each item | Weak excerpts break the final claim |
| WANDR-style research | Do both across hundreds or thousands of records | Every branch can fail independently |

Perplexity's own [Wide Research API documentation](https://docs.perplexity.ai/docs/agent-api/wide-research) makes the product implication explicit: the preset is for tasks like "find every company that matches X and cite a source for each." This is not answer-engine gloss. It is the operational shape of AI-mediated research.

A separate June 2026 paper using production data from Perplexity's Search and Computer products found that Computer performed 26 minutes of autonomous work per user session versus 33 seconds for Search, and reduced matched-task completion time from 269 minutes to 36 minutes ([arXiv:2606.07489](https://arxiv.org/abs/2606.07489)). The point is not that agents replace search. The point is that search is becoming longer-running, evidence-heavy work.

## The WANDR result says evidence depth is the bottleneck

The headline number is uncomfortable. Perplexity says that even at a high-effort setting, the strongest system in the WANDR evaluation reached only 0.363 soft F1 and 0.133 hard F1. In the same analysis, Perplexity says the best hard precision was 0.150 and the best hard recall was 0.134, meaning the leader earned full credit for only about one in seven submitted members and one in seven requested members.

That is the right way to read WANDR: not as a leaderboard victory lap, but as a map of where research agents break. Soft scoring gives partial credit to incomplete members. Hard scoring counts only the members whose full required subtree is correct. A wide gap between the two means the agent found something, but did not finish the evidence chain.

Perplexity's analysis localizes the failure. It says top-level discovery completion ranged from 0.611 to 0.951 across systems, while terminal evidence-slot completion reached 0.979 to 0.994 once a member and enrichment path existed. The problem is not always the final URL. The bigger loss happens before the system has found, qualified, and carried enough entities into the final evidence step.

WANDR also reports that only 3.2% to 8.9% of submitted pages were unusable for five systems, while 57.5% to 86.6% of submitted excerpts failed to support everything the record claimed. Perplexity's rate was 57.5%. Finding a usable page is no longer the hard part. Making every cited excerpt support every required claim is the hard part.

## Brands should optimize for complete evidence paths, not just crawlable pages

For technical marketers, WANDR points to a sharper AI visibility rule: answer engines reward source paths that survive evidence checks. A page can be crawlable, relevant, and still weak if its claims are hard to qualify, its entity names are ambiguous, or its supporting proof is split across disconnected pages.

This is where [Machine Relations](https://machinerelations.ai/glossary/machine-relations) becomes a useful lens without turning the article into a pitch. The framework treats AI discovery as a system of entity clarity, citation architecture, earned authority, distribution, and measurement. Machine Relations was [coined by Jaxon Parrott](https://jaxonparrott.com/blog/when-ai-stops-being-theoretical) in 2024, and the category's practical value is easiest to see in benchmarks like WANDR: the machine needs complete proof, not brand positioning.

[AuthorityTech's publication intelligence data](https://authoritytech.io/publications) is relevant here because it tracks which publications and source types AI engines retrieve and cite. That kind of source map matters more after WANDR. If research agents fail when evidence chains get wide and deep, then brands need pages that make entities, claims, and source support easier to resolve across the graph.

The operational move is [citation architecture](https://machinerelations.ai/glossary/citation-architecture), not more generic content. Each important claim should name the entity, state the condition, cite the source, and keep the supporting excerpt close to the claim. Machine-readable structure is not decoration. It is how an answer system decides whether the evidence is complete enough to carry forward.

## WANDR makes "AI search optimization" more engineering than copywriting

WANDR's most useful contribution is the scoring structure. Perplexity says the benchmark can localize failure to discovery, enrichment, identity handling, semantic qualification, or evidence construction. Those are system failures, not headline-writing failures.

That should change how teams brief AI visibility work:

| Workstream | Weak version | Stronger WANDR-era version |
|---|---|---|
| Entity pages | About-page copy | Stable entity facts, same names, same relationships |
| Source pages | Blog posts with claims | Claims paired with direct primary-source evidence |
| Comparison pages | Marketing tables | Criteria, named entities, and cited support per row |
| Research pages | Narrative reports | Structured findings that agents can verify record by record |
| Measurement | Rankings and referrals | Share of citation, source retrieval, and evidence failure checks |

This also explains why [share of citation](https://machinerelations.ai/glossary/share-of-citation) is a better metric than raw AI referral traffic for this class of work. A research agent may use a source without sending much traffic. The first signal is whether the brand or source gets retrieved, cited, and trusted inside the answer path.

The smart response to WANDR is not panic about agent quality. It is to make the web easier for agents to verify. Publish fewer unsupported assertions. Collapse entity ambiguity. Put evidence where the claim is made. Use structured tables when the information is comparative. Link to primary sources and stable entity references. Then measure whether AI systems cite those proof paths.

For teams that want a quick read on whether their brand is already legible to answer engines, the clean starting point is an [AI visibility audit](https://app.authoritytech.io/visibility-audit). The useful question is no longer just "do we appear?" It is "can a research agent prove the claim well enough to cite us?"

## FAQ

### What is Perplexity WANDR?

Perplexity WANDR is an open benchmark and evaluation harness for wide-and-deep research agents. Perplexity says it contains 500 public task packages and tests whether systems can discover broad sets of items, enrich each item, and support the final records with evidence.

### Why does WANDR matter for AI search?

WANDR matters because it measures the part of AI search that ordinary rankings hide: whether an agent can carry a complete evidence chain across many records. Perplexity's own results show that full-credit completion remains low even when systems can find plausible pages.

### What should marketers do after WANDR?

Marketers should make their source material easier to verify. That means clear entity names, direct claims, primary-source links, structured comparison tables, and evidence placed near the claim it supports. The goal is not more content. The goal is a source path an AI research agent can finish.
