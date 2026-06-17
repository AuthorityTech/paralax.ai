---
title: "Google Just Lost Its Safe Harbor: A German Court Ruled AI Overviews Are Publishing, Not Search"
slug: "google-ai-overviews-liability-ruling-safe-harbor-2026"
date: "2026-06-17"
description: "A Munich court held Google directly liable for false AI Overviews claims — the first ruling to treat synthesis as authorship, not search."
tags: ["ai-search", "ai-liability"]
---

A Munich court has held Google directly liable for defamatory statements its AI Overviews generated about two publishers — the first time a court has treated an AI answer feature as the speaker rather than a neutral conduit. The reasoning matters more than the verdict: when a machine summarizes and structures an answer that exists in no single source, it stops being a librarian and becomes a publisher.

## What the court actually ruled

On May 28, 2026, the Landgericht München I issued a preliminary injunction ([case 26 O 869/26](https://ppc.land/munich-court-holds-google-liable-for-ai-overviews-defamation-a-first/)) prohibiting Google from repeating specific false claims its AI Overviews produced about a Munich-based media group and its GeraMond subsidiary. The claims were severe: that the publishers ran subscription traps, invoiced for services after phone calls that never happened, and changed names to evade identification. None of it was true.

The output surfaced when users searched the publisher's name alongside the German word *Betrugsmasche* — "fraud scheme." According to the court record, [the AI Overview returned a structured response](https://vktr.com/ai-news/german-court-rules-google-can-be-liable-for-false-ai-overview-claims) with an affirmative opening line, a section titled "characteristics of the alleged fraud scheme," and a "what you can do" section. It read like an editorial verdict, not a list of links.

Each future violation carries a fine of up to €250,000, with custodial exposure for Google executives under section 890 of the German Code of Civil Procedure. Google was ordered to bear 80 percent of costs.

## Why "synthesis" broke the conduit defense

For 25 years, search engines have been shielded by a simple legal premise: they point to other people's speech, they do not author it. German courts, following Federal Court of Justice precedent, extended reduced liability to search on the ground that it is indispensable infrastructure for navigating the web.

The Munich court refused to extend that shield to AI Overviews, reasoning that the feature is supplementary rather than [indispensable for using the internet](https://arstechnica.com/tech-policy/2026/06/nobody-needs-ai-to-search-the-internet-court-says-in-ruling-against-google/). The four-part logic is the part every answer engine should read closely:

| Argument | What it means for engines |
|---|---|
| The output summarizes and structures, unlike a ranked link list | Synthesis is original expression, not a pointer |
| Google built the feature and solely controls the algorithm | Control implies responsibility for output |
| A plain name search returns nothing similar | The claim originated in the model, not the index |
| Search is essential infrastructure; AI Overviews are supplementary | No strong public-interest protection applies |

The decisive finding: [the AI fabricated connections](https://www.techtimes.com/articles/318489/20260616/google-ai-overviews-defamation-ruling-ends-search-safe-harbor-every-ai-answer-engine.htm) — links between the plaintiffs and other named companies — that appeared in none of the sources it cited as references. The model did not misquote the web. It invented, then attributed.

Google's defense leaned on the EU Digital Services Act's hosting-provider exemption and, failing that, a search-engine "notice and takedown" standard. The court rejected both. A hosting provider stores third-party content; it does not generate the sentence. That distinction is now load-bearing.

## What changes for anyone building or measuring AI visibility

This is a preliminary injunction in one jurisdiction, not settled appellate law. But the logic travels, and it inverts a core assumption of the AI search era: that the engine is a neutral mirror of the web. It is not. It is a writer with an audience of billions and, now, a documented liability surface.

Three consequences follow.

**Accuracy becomes a legal interface, not just a brand problem.** What an engine asserts about your company is now actionable. The notice-and-injunction path the Munich publishers used is a tool any brand can reach for when a machine fabricates. The flip side: the burden of monitoring what engines say about you moves from optional to operational.

**Grounding stops being a quality nicety and becomes risk control.** The ruling punishes exactly the failure mode of ungrounded synthesis — claims with citations that don't support them. Engines now have a liability incentive to tie every assertion to a verifiable source, which rewards entities that are clearly defined and consistently attributed across the web. This is the discipline the [Machine Relations framework](https://machinerelations.ai/glossary/machine-relations) describes: managing how machines mediate what is known about you. Analysis of [how answer engines select sources](https://machinerelations.ai/research/ai-citations-how-answer-engines-select-sources-2026) shows the models lean on whatever external corpus is densest and most consistent — which means a thin or contradictory entity footprint is now both a visibility gap and a defamation risk.

**Measurement has to cover sentiment, not just presence.** Most AI-visibility tooling answers "are we cited?" The Munich case proves the more dangerous question is "what is being said?" As founder Jaxon Parrott has argued in mapping [how engines decide which sources to cite](https://jaxonparrott.com/blog/how-ai-engines-decide-which-sources-to-cite-2026), the citation layer is where reputation is now manufactured — and a fabricated negative claim is far more expensive than an absent one. AuthorityTech's work on [source authority](https://authoritytech.io/glossary/source-authority) frames the same point structurally: the engines weight some sources as ground truth, and being one of them is the difference between correcting the record and living with the machine's version of it.

The engines have spent two years optimizing for confident, synthesized answers. Munich just attached a price to confidence that outruns its sources.

## FAQ

### Does this ruling apply outside Germany?
Not directly. It is a preliminary injunction from a single German regional court and has not been tested on appeal. But the core reasoning — that AI synthesis is authored expression rather than conduit search — is jurisdiction-agnostic and gives plaintiffs elsewhere a template to argue from.

### What should a brand do if an AI engine states something false about it?
Document the exact query and output, capture timestamps, and send a formal notice to the provider. The Munich plaintiffs established the pattern across multiple dated searches before seeking an injunction. Continuous monitoring of what engines assert about your entity — not just whether you appear — is the prerequisite. You can [audit your current AI visibility](https://app.authoritytech.io/visibility-audit) as a starting baseline.

### Why doesn't the hosting-provider defense work for AI Overviews?
A hosting provider stores and transmits content created by others. The court found AI Overviews generate new sentences — assembling claims that exist in no underlying source — which makes Google the author, not the host. The Digital Services Act exemption covers storage, not generation.
