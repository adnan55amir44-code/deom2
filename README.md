# MCP Weather

Real-time weather web app with:

- Express server
- Model Context Protocol (MCP) Streamable HTTP endpoint
- `get_weather` MCP tool
- wttr.in weather source (no weather API key)
- Browser Geolocation
- Browser Text-to-Speech
- Gemini CLI MCP configuration
- Chrome DevTools MCP configuration

## Architecture

```
Browser UI
   |
   +--> /api/weather --> wttr.in
   |
Gemini CLI
   |
   +--> /mcp --> get_weather --> wttr.in
   |
   +--> chrome-devtools MCP --> Google Chrome
```

## Run locally

```bash
npm install
npm start
```

Open:

```
http://localhost:3000
```

MCP endpoint:

```
http://localhost:3000/mcp
```

Health:

```
http://localhost:3000/health
```

## Gemini CLI

Gemini CLI supports Streamable HTTP MCP servers through `httpUrl`. The project contains:

```
.gemini/settings.json
```

By default it connects to:

```
http://localhost:3000/mcp
```

For a deployed MCP server, set the environment variable before starting Gemini CLI.

PowerShell:

```powershell
$env:MCP_WEATHER_URL="https://YOUR-DOMAIN.vercel.app/mcp"
gemini
```

Then verify the MCP server:

```
gemini mcp list
```

Example prompts:

- "Use the weather MCP and tell me the current weather in Dubai."
- "Use the weather MCP for Karachi."
- "Compare the current weather in London and Tokyo."

## Chrome DevTools MCP

The project configuration also includes Google's Chrome DevTools MCP:

```text
chrome-devtools
```

It starts with:

```bash
npx -y chrome-devtools-mcp@latest
```

This is a separate browser-control MCP server. It can open and inspect Chrome pages, automate supported browser actions, inspect network requests, console messages and take screenshots.

It is **not** a Google Search API. If you search Google, the MCP is controlling/inspecting Chrome and the Google Search page.

## Vercel

This repository uses an Express app export for Vercel. The application keeps local `app.listen()` behavior while exporting the Express app for Vercel.

After deployment, use:

```
https://YOUR-DOMAIN.vercel.app/mcp
```

as the remote MCP endpoint.

Do not commit API keys, tokens, passwords, or private credentials.
