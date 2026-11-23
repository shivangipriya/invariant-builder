# Invariant Builder

A small browser tool that turns a plain-language feature description into candidate invariants - statements of what might need to stay true while the feature runs - each with its assumptions shown, an alternative policy where one commonly exists, and a concrete way to test it. Nothing it suggests is a requirement until you accept it.

**Why it exists:** the idea comes from a real, recent founder post on r/SaaS (https://www.reddit.com/r/SaaS/comments/1xhhl51/) describing bugs that produce no error at all: an invoice that saves successfully with a wrong total, inventory that updates incorrectly, dashboard numbers that drift from the database, one company's data becoming visible to another. Catching that class of bug starts with writing down what correct means. This tool helps you write that down.

## Use it

Open `index.html` in any browser. Describe a feature. The tool drafts candidate invariants, each:

- **starting at "Not sure"** - you accept only what you have verified against how your product actually works
- **showing its assumption** - the business rule it depends on (for example "assumes backorders are not allowed"), editable
- **offering the common alternative policy** where one exists (backorders allowed, digital-goods refunds, future-dated scheduled records, sessions kept after password change), swappable in one click
- **traced honestly** - cards say "suggested by your line" (a pattern match, not a requirement read out of your text) or "general safeguard"
- **editable** - statement and assumption both, before you accept

It also offers prompts (not proof) for effects you described that no accepted candidate covers, and flags possible wording conflicts between your own sentences - which may be real conflicts or may differ by actor, scope, or time. Accept what survives your judgement, then copy the markdown spec into a ticket, your repo, or your AI coding agent's instructions.

## What it is not

- It does not verify any code. It produces a written spec of what correct means; you, your tests, or your tooling still have to check it.
- It does not know your business rules. A wrong assumption makes a wrong candidate; the assumptions are visible and editable for exactly that reason.
- It is a pattern engine, and a basic one. It will miss things and suggest things that do not fit.
- It is not the only approach nearby: property-based testing libraries (fast-check, Hypothesis), spec languages, and AI coding assistants all work on adjacent problems. This is the plain-language step before those.

## Privacy

Everything runs in the page. Nothing you type is sent anywhere, stored, or logged.

## Stack

Single `index.html`. No build step, no dependencies, no network calls.

---

Maintained by Shivangi Priya.
