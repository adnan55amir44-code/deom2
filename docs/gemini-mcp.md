# Google Antigravity + MCP

This project is prepared for Google's current Antigravity MCP client.

## MCP servers

### Weather MCP

Local endpoint:

```text
http://localhost:3000/mcp
```

Tool:

```text
get_weather({ city })
```

Example request:

> Use the weather MCP and tell me the current weather in Dubai.

### Chrome DevTools MCP

The project also includes the official Chrome DevTools MCP configuration:

```text
npx -y chrome-devtools-mcp@latest
```

This lets an MCP client control and inspect Google Chrome. It is browser automation/debugging, not a separate Google Search API.

## Antigravity configuration

The MCP configuration is stored at:

```text
.agents/mcp_config.json
```

Antigravity supports remote Streamable HTTP MCP servers using the `serverUrl` property.

### Local testing

Start the Weather server:

```bash
npm install
npm start
```

Then run Antigravity and open the MCP manager with:

```text
/mcp
```

The Weather server should point to:

```text
http://localhost:3000/mcp
```

### Vercel deployment

After the project is deployed, replace the local server URL in `.agents/mcp_config.json` with your real HTTPS Vercel MCP endpoint:

```text
https://YOUR-DOMAIN.vercel.app/mcp
```

Do not use a guessed deployment URL. Use the actual URL shown by Vercel after deployment.

## Architecture

```
Google Antigravity
       |
       +---- Weather MCP
       |       |
       |       +---- get_weather
       |               |
       |              wttr.in
       |
       +---- Chrome DevTools MCP
               |
              Chrome
```
