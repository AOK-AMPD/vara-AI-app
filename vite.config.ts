import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildClaudeRequest, createClaudeMessage } from './api/_lib/claude.js'

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = ''

    req.on('data', chunk => {
      raw += chunk
    })

    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

const claudeDevApiPlugin = {
  name: 'claude-dev-api',
  configureServer(server: any) {
    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (!req.url?.startsWith('/api/claude')) {
        next()
        return
      }

      if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'Method not allowed.' })
        return
      }

      try {
        const body = await readJsonBody(req)
        const payload = buildClaudeRequest(body)
        const result = await createClaudeMessage(payload)
        sendJson(res, 200, result)
      } catch (error) {
        const status = typeof (error as { status?: unknown })?.status === 'number'
          ? Number((error as { status?: unknown }).status)
          : 500
        const message = error instanceof Error ? error.message : 'Claude request failed.'
        sendJson(res, status, { error: message })
      }
    })
  },
}

const secProxyOptions = {
  target: 'https://www.sec.gov',
  changeOrigin: true,
  headers: {
    'User-Agent': 'Intellicomply Research App contact@intellicomply.example.com'
  },
  configure: (proxy: any, _options: any) => {
    proxy.on('proxyRes', (proxyRes: any) => {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
      
      // Rewrite redirects to ensure they stay on the local dev server
      if (proxyRes.headers['location']) {
         let loc = proxyRes.headers['location'];
         if (loc.startsWith('https://www.sec.gov')) {
           proxyRes.headers['location'] = loc.replace('https://www.sec.gov', '');
         }
      }
    });
  }
};

const secDataProxyOptions = {
  target: 'https://data.sec.gov',
  changeOrigin: true,
  headers: {
    'User-Agent': 'Intellicomply Research App contact@intellicomply.example.com'
  },
  configure: (proxy: any, _options: any) => {
    proxy.on('proxyRes', (proxyRes: any) => {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
    });
  }
};

const eftsProxyOptions = {
  target: 'https://efts.sec.gov',
  changeOrigin: true,
  headers: {
    'User-Agent': 'Intellicomply Research App contact@intellicomply.example.com'
  },
};

export default defineConfig({
  plugins: [react(), claudeDevApiPlugin],
  server: {
    proxy: {
      '/sec-proxy': {
        ...secProxyOptions,
        rewrite: (path) => path.replace(/^\/sec-proxy/, '')
      },
      // Proxy for data.sec.gov (XBRL companyfacts + submissions)
      '/sec-data': {
        ...secDataProxyOptions,
        rewrite: (path) => path.replace(/^\/sec-data/, '')
      },
      // Proxy for efts.sec.gov (full-text search)
      '/sec-efts': {
        ...eftsProxyOptions,
        rewrite: (path) => path.replace(/^\/sec-efts/, '')
      },
      '/ix': secProxyOptions,
      '/ixviewer': secProxyOptions,
      '/Archives': secProxyOptions,
      '/include': secProxyOptions,
      '/files': secProxyOptions,
      '/assets': secProxyOptions,
      '/cdata': secProxyOptions,
      '/js': secProxyOptions,
      '/css': secProxyOptions,
      '/images': secProxyOptions
    }
  }
})

