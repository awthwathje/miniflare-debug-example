interface Item {
  readonly id: string
  readonly label: string
}

type Items = Item[]

interface Message {
  readonly action: string
  readonly payload?: unknown
}

interface Env {}

export class List {
  state: DurableObjectState
  sockets: WebSocket[]

  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    this.sockets = []
  }

  clearSocket(socket: WebSocket): void {
    this.sockets = this.sockets.filter((_socket) => _socket !== socket)
    socket.close() // <== THIS CONFUSES MINIFLARE
  }

  broadcast(message: Message): void {
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify(message))
    })
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/main') {
      const { 0: clientSocket, 1: socket } = new WebSocketPair()

      socket.accept()

      this.sockets.push(socket)

      socket.addEventListener('message', async ({ data }) => {
        try {
          const { action } = JSON.parse(data as string)

          if (action === 'LIST') {
            socket.send(
              JSON.stringify({
                action: 'LIST',
                payload: [
                  { id: '0', label: 'Apple' },
                  { id: '1', label: 'Banana' }
                ] as Items
              })
            )
          }
        } catch (error) {
          socket.send(JSON.stringify({ error }))
        }
      })

      socket.addEventListener('close', () => {
        console.log('CLOSE EVENT RECEIVED')

        this.clearSocket(socket)
      })

      socket.addEventListener('error', () => {
        console.log('ERROR EVENT RECEIVED')

        this.clearSocket(socket)
      })

      return new Response(null, {
        status: 101,
        webSocket: clientSocket
      })
    }

    return new Response('Not found', { status: 404 })
  }
}
