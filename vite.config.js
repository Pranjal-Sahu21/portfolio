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
                  const groqKey = env.GROQ_API_KEY
                  const geminiKey = env.GEMINI_API_KEY
                  const openaiKey = env.OPENAI_API_KEY
                  const puterToken = env.PUTER_AUTH_TOKEN || env.VITE_PUTER_AUTH_TOKEN

                  let endpoint = ''
                  let headers = { 'Content-Type': 'application/json' }
                  let payload = {}

                  if (groqKey) {
                    endpoint = 'https://api.groq.com/openai/v1/chat/completions'
                    headers['Authorization'] = `Bearer ${groqKey}`
                    payload = { model: 'openai/gpt-oss-120b', messages }
                  } else if (geminiKey) {
                    endpoint = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
                    headers['Authorization'] = `Bearer ${geminiKey}`
                    payload = { model: 'gemini-1.5-flash', messages }
                  } else if (openaiKey) {
                    endpoint = 'https://api.openai.com/v1/chat/completions'
                    headers['Authorization'] = `Bearer ${openaiKey}`
                    payload = { model: 'gpt-4o-mini', messages }
                  } else if (puterToken) {
                    endpoint = 'https://api.puter.com/puterai/openai/v1/chat/completions'
                    headers['Authorization'] = `Bearer ${puterToken}`
                    payload = { model: 'gpt-4o-mini', messages }
                  } else {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ error: 'No API key found in .env' }))
                    return
                  }

                  const apiRes = await fetch(endpoint, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                  })

                  if (!apiRes.ok) {
                    const errData = await apiRes.text()
                    console.error('Local dev AI error:', apiRes.status, errData)
                    res.statusCode = apiRes.status
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ error: errData }))
                    return
                  }

                  const data = await apiRes.json()
                  const reply = data.choices?.[0]?.message?.content || ''

                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ reply }))
                } catch (err) {
                  console.error('Local dev proxy error:', err)
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
