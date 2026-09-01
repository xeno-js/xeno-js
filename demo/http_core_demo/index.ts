import http from 'node:http';
import { HttpRequest } from '@xeno/core';
import { bootstrap } from './bootstrap';

// ─────────────────────────────────────────────────────────────────────────────
// RUN DEMO FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
// This function initializes the Xeno container, sets up an HTTP server, and defines a single endpoint for fetching data from the PokeAPI. It resolves the necessary data source from the service container and starts the server on port 3000.
async function runDemo() {
  console.log('⚙️ Inizializzazione Xeno Container...')
  // 1. Bootstrap the application and get the service container
  const container = await bootstrap()

  // 2. Resolve the data source from the container
  const dataSource = container.resolve('MY_HTTP_CLIENT_TOKEN')

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
          signal: new AbortController().signal
        }
        // 4. Use the data source to fetch data from the PokeAPI
        const pokemonData = await dataSource.get(requestUrl, request)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(pokemonData.data))
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

  // 5. Start the server on port 5000
  server.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000')
  })
}

// Run the demo
runDemo()
