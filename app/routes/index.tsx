import { useState } from 'react'
import { useEffect, useRef } from 'react'

export default function Index(): JSX.Element {
  const socket = useRef<WebSocket | null>(null)
  const [list, setList] = useState([])

  useEffect(() => {
    if (socket.current === null) {
      const url = 'ws://localhost:8787/api/ws'

      socket.current = new WebSocket(url)

      socket.current.addEventListener('open', () => {
        console.log('WEBSOCKET OPENED', socket.current)
        socket.current?.send(
          JSON.stringify({
            action: 'LIST'
          })
        )
      })

      socket.current.addEventListener('message', ({ data }: MessageEvent) => {
        const { action, payload } = JSON.parse(data)

        if (action === 'LIST') setList(payload)
      })

      socket.current.addEventListener('close', (event) => {
        console.log('WEBSOCKET CLOSED', event)
      })

      socket.current.addEventListener('error', (event) => {
        console.log('WEBSOCKET ERRORED', event)
      })
    }

    return function cleanup() {
      console.log('WEBSOCKET CLEANUP', socket.current)
      socket.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main>
      <>
        {list.length > 0 && (
          <>
            <h3>List:</h3>
            
            <ul>
              {list.map(({ id, label }) => (
                <li key={id}>
                  <div>{label}</div>
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          onClick={() => {
            socket.current?.close()
          }}
        >
          Close socket
        </button>
      </>
    </main>
  )
}
