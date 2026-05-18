---
description: This file describes the data fetching strategy for the project.
applyTo: '**'
---
## Data Fetching Strategy
This document outlines the data fetching strategy for the project. The project utilizes server components for data fetching and client components for interactivity.

## 1. Server Components for Data Fetching
In this project, we prefer using server components for data fetching whenever possible. Server components allow us to fetch data on the server and send the rendered HTML to the client, which can improve performance and SEO.

## 2. data fetching methods
ALWAYS use the helper functions in /data directory for data fetching. NEVER fecth data directly in the component. This ensures a clear separation of concerns and makes it easier to manage data fetching logic.

All helper functions in the /data directory should use Drizzle ORM to interact with the PostgreSQL database. 