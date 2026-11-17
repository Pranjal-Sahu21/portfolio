import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tailwindcss(),
      react(),
      {
        name: 'netlify-chat-dev-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if ((req.url === '/api/chat' || req.url === '/.netlify/functions/chat') && req.method === 'POST') {
              let body = ''
              req.on('data', (chunk) => {
                body += chunk
              })
              req.on('end', async () => {
                try {
                  const { messages } = JSON.parse(body)
                  const token = env.PUTER_AUTH_TOKEN || env.VITE_PUTER_AUTH_TOKEN

                  if (!token) {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ error: 'PUTER_AUTH_TOKEN not configured in .env' }))
                    return
                  }

                  const puterRes = await fetch('https://api.puter.com/puterai/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      model: 'gpt-4o-mini',
                      messages
                    })
                  })

                  const data = await puterRes.json()
                  const reply = data.choices?.[0]?.message?.content || ''

                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ reply }))
                } catch (err) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }
            next()
          })
        }
      }
    ],
  }
})
