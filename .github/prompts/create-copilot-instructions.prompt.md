---
name: create-copilot-instructions
description: This prompt is used to create a new agent instructions file under instructions directory based on provided information about a layer of architecture or coding standards.
agent: Instructions Generator
---

Take the information below and generate a [NAME].instructions.md file for it in the /.github/ instructions directory. If a .md filename is provided then use that otherwise generate an appropriate filename based on the generated content.The instructions should be concise, clear, and formatted in markdown. If no information is provided, ask the user for more details about the layer of architecture or coding standards they want to generate instructions for.