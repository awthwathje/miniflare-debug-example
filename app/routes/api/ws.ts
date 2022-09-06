import type { LoaderArgs } from '@remix-run/cloudflare'

export const loader = async ({ request }: LoaderArgs) => {
  if (request.headers.get('Upgrade') !== 'websocket')
    return new Response('Expected "Upgrade: websocket"', {
      status: 426
    })

  const id = LIST.idFromName('TOTALLY_UNIQUE_STRING')
  const stub = LIST.get(id)

  return stub.fetch('http://0.0.0.0/main', {
    headers: { Upgrade: 'websocket' }
  })
}
