---
name: create-instructions
description: This prompt is used to create a new agent instructions file in the /docs directory based on provided information about a layer of architecture or coding standards.
agent: Instructions Generator
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

Take the information below and generate an agent instructions .md file for it in the /docs directory. If a .md filename is provided then use that otherwise generate an appropriate filename based on the generated content.The instructions should be concise, clear, and formatted in markdown. Make sure to update the AGENTS.md file to reference this new docs file. If no information is provided, ask the user for more details about the layer of architecture or coding standards they want to generate instructions for.