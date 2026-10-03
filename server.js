import express from "express";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { getWeather } from "./weather.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({
        success: false,
        error: "City is required."
      });
    }

    const weather = await getWeather(city);

    res.json({
      success: true,
      weather
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function createMcpServer() {
  const server = new McpServer({
    name: "mcp-weather-server",
    version: "1.0.0"
  });

  server.registerTool(
    "get_weather",
    {
      title: "Get Weather",
      description: "Get current real-time weather information for a city.",
      inputSchema: {
        city: z
          .string()
          .min(1)
          .describe("City name, for example Karachi or London")
      }
    },
    async ({ city }) => {
      try {
        const weather = await getWeather(city);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(weather, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Weather error: ${error.message}`
            }
          ]
        };
      }
    }
  );

  return server;
}

app.all("/mcp", async (req, res) => {
  try {
    const server = createMcpServer();

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP Error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "MCP server error"
      });
    }
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    server: "MCP Weather Server",
    version: "1.0.0"
  });
});

// Vercel uses the exported Express app.
// Local development still uses app.listen().
export default app;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log("");
    console.log("======================================");
    console.log("        MCP WEATHER SERVER");
    console.log("======================================");
    console.log("");
    console.log(`Website : http://localhost:${PORT}`);
    console.log(`Weather : http://localhost:${PORT}/api/weather?city=Karachi`);
    console.log(`MCP     : http://localhost:${PORT}/mcp`);
    console.log(`Health  : http://localhost:${PORT}/health`);
    console.log("");
    console.log("======================================");
    console.log("");
  });
}
