---
title: "Use AI to Manage Your Server: DavPanel Docs Now Available via llms.txt"
description: "Feed the complete DavPanel documentation into ChatGPT, Claude, or Cursor and get accurate answers about installation, davcli commands, and server management."
slug: davpanel-llms-usage-guide
authors: kangpcode
image: https://davpanel.com/img/blog/davpanel_llms.png
hide_table_of_contents: true
---

DavPanel is now available in an AI-friendly format at [davpanel.com/llms.txt](https://davpanel.com/llms.txt) and [davpanel.com/llms-full.txt](https://davpanel.com/llms-full.txt). This means you can give ChatGPT, Claude, Cursor, or any other AI assistant instant access to our site and docs — and get accurate answers instead of guesses.

Here's how to use it.

<!-- truncate -->

## What are these files?

We publish two files, following the [llms.txt](https://llmstxt.org/) standard:

- **[davpanel.com/llms.txt](https://davpanel.com/llms.txt)** is a short index of the DavPanel website - the homepage, features, pricing, comparisons, and other pages - each with a one-line description and link. Use this when an AI just needs an overview and can follow links as needed.
- **[davpanel.com/llms-full.txt](https://davpanel.com/llms-full.txt)** contains the complete DavPanel documentation in a single markdown file, regenerated automatically with every documentation update. Use this when an AI needs the full docs in one shot - installation steps, `davcli` commands, API reference, and everything else.

AI models often have outdated or incomplete knowledge about DavPanel. By pointing them at these files, you're giving them the current docs — including the latest `davcli` commands, API endpoints, and features.

## ChatGPT

Paste the URL directly into your prompt:

```
Read https://davpanel.com/llms-full.txt and then answer:
how do I set up a DNS cluster with two DavPanel servers?
```

ChatGPT will fetch the file and answer using the actual documentation instead of stale training data.

## Claude

Same approach — paste the link in your message:

```
Use the docs at https://davpanel.com/llms-full.txt as your reference.
How do I limit CPU and RAM for a specific user?
```

If you use **Claude Projects**, add the file once as project knowledge: download `llms-full.txt` and upload it to your project. Every conversation in that project then has full DavPanel context without re-fetching.

## Cursor

In Cursor, add our docs as a documentation source:

1. Open **Settings → Features → Docs**
2. Click **Add new doc**
3. Enter `https://davpanel.com/llms-full.txt`

Then reference it in any chat with `@Docs` and select DavPanel. Cursor will use the documentation when writing scripts against the DavPanel API, `davcli`, or building integrations.

## Claude Code and other CLI agents

Working on automation scripts for your DavPanel server? Tell your coding agent to load the docs first:

```
Fetch https://davpanel.com/llms-full.txt for DavPanel documentation,
then write a bash script that creates 10 users with the nginx-mariadb plan.
```

## DavPanel MCP: go beyond docs

Reading docs is one thing — since **DavPanel 1.7.65**, AI assistants can also *manage your server directly* through our [MCP (Model Context Protocol) support](https://davpanel.com/docs/panel/account/mcp/), covering 160+ API endpoints. Combine the two: llms-full.txt gives your AI the knowledge, MCP gives it the hands.

## Example prompts to try

Once your AI has the docs loaded:

- "What's the difference between the Community and Enterprise editions?"
- "Walk me through migrating accounts from cPanel to DavPanel"
- "Which davcli command changes a user's PHP version?"
- "Write a monitoring script that alerts me when a user's container is down"

## Why we did this

AI assistants are how a growing number of admins troubleshoot and learn. If the model has stale training data, you get wrong answers and wasted time. Publishing an llms.txt and llms-full.txt costs us nothing to maintain (both are generated on every build) and gives you a reliable way to bring any AI up to speed on DavPanel in one prompt.

Try it: [davpanel.com/llms.txt](https://davpanel.com/llms.txt) or [davpanel.com/llms-full.txt](https://davpanel.com/llms-full.txt)
