import build from '@hono/vite-build/vercel'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build({
      // Override the after-hooks and default export to pass process.env as bindings
      // to app.fetch() so c.env is populated in the Hono context on Vercel Node.js.
      // The default @hono/node-server/vercel handle() does not pass env.
      // We use globalThis["process"]["env"] to prevent Vite from replacing process.env with {}.
      entryContentAfterHooks: [
        () => `import { getRequestListener } from '@hono/node-server'`
      ],
      entryContentDefaultExportHook: (appName) =>
        `const _getEnv = () => globalThis["process"]["env"]\nconst handleWithEnv = (app) => getRequestListener((req) => app.fetch(req, _getEnv()))\nexport default handleWithEnv(${appName})`
    }),
    devServer({
      entry: 'src/index.tsx'
    })
  ]
})
