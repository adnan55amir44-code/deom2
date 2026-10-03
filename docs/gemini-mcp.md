# Gemini + MCP Setup

This project can be used with Google's Gemini CLI as an MCP client.

## What is connected

### 1. Weather MCP

The project exposes:

- `http://localhost:3000/mcp`
- Tool: `get_weather({ city })`

Gemini CLI connects to this Streamable HTTP endpoint.

### 2. Chrome DevTools MCP

Google's Chrome DevTools MCP can be started locally through:

```bash
npx -y chrome-devtools-mcp@latest
```

It lets an MCP-capable AI client inspect and control Google Chrome.

## Run the Weather MCP locally

First install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The weather MCP will be available at:

```text
http://localhost:3000/mcp
```

## Gemini CLI

Install Gemini CLI, open this project directory, then run:

```bash
gemini
```

The project configuration is in:

```text
.gemini/settings.json
```

You can also add the weather server manually:

```bash
gemini mcp add --transport http weather http://localhost:3000/mcp
```

Then check:

```bash
gemini mcp list
```

## Example prompts

Ask Gemini:

- "What is the current weather in Karachi?"
- "Get the weather in Dubai using the weather MCP."
- "Compare the current weather in Karachi and London."

Gemini should use the `get_weather` MCP tool for these requests.

## Google Chrome

For browser automation/debugging through Chrome DevTools MCP, Gemini can use the `chrome-devtools` MCP server configured above.

Example:

```text
Open Google in Chrome and inspect the page.
```

Important: Chrome DevTools MCP is a browser-control/debugging MCP, not a dedicated Google Search API. It can navigate and inspect Chrome pages, including Google Search.

## Vercel deployment

The Weather MCP can also be exposed through a deployed HTTPS URL. Gemini CLI supports a Streamable HTTP MCP URL through `httpUrl`.

After deployment, replace:

```json
"httpUrl": "http://localhost:3000/mcp"
```

with your deployed endpoint:

```json
"httpUrl": "https://YOUR-DOMAIN.vercel.app/mcp"
```

Do not put private API keys or authentication tokens in this repository.
