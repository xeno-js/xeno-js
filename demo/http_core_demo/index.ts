import http from 'node:http';
import { HttpRequest } from '@graviton5/core';
import { bootstrap } from './bootstrap';
import { DATA_SOURCE_TOKEN } from './tokens';

// ─────────────────────────────────────────────────────────────────────────────
// RUN DEMO FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function initializes the Graviton5 container, sets up an HTTP server, and defines a single endpoint for fetching data from the PokeAPI. It resolves the necessary data source from the service container and starts the server on port 3000.
async function runDemo() {
  console.log('⚙️ Inizializzazione Graviton5 Container...')
  // 1. Bootstrap the application and get the service container
  const container = await bootstrap()

  // 2. Resolve the data source from the container
  const dataSource = container.resolve(DATA_SOURCE_TOKEN)

  // 3. Create an HTTP server to handle requests
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    console.log(`Received request: ${req.method} ${url.pathname}${url.search}`);
    if (url.pathname.startsWith('/pokemon/')) {
      const name = url.pathname.split('/')[2];
      if (!name) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Pokemon name is required' }));
        return;
      }

      try {
        const requestUrl = `pokemon/${name.toLowerCase()}`;
        const request: HttpRequest<unknown> = {
          method: 'GET',
          query: Object.fromEntries(url.searchParams.entries()),
          url: requestUrl,
          signal: new AbortController().signal
        }
        // 4. Use the data source to fetch data from the PokeAPI
        const pokemonData = await dataSource.send(request.url, request)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        if (pokemonData.isOk()) {
          res.end(JSON.stringify(pokemonData.getValueOrThrow()))
        } else {
          res.end(JSON.stringify({ error: pokemonData.getErrorOrThrow() }))
        }
      } catch (error) {
        console.error('Error fetching pokemon:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Failed to fetch data' }))
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Not Found' }))
    }
  })

  // 5. Start the server on port 3000
  server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000')
  })
}

// Run the demo
runDemo()
