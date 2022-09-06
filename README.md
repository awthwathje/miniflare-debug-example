miniflare-debug-example
=

This reproduction repo demonstrates the issue with Miniflare when it errors on Durable Objects' WebSocket close.

How to reproduce
-

1. Start Miniflare:
```
npm run dev:worker
```

2. Start Remix:
```
npm run dev:remix
```

On first load, the WebSocket to a Durable Object will be opened automatically and the list of items will be retrieved and displayed.

On click of the "Close socket" button, the client will request the WebSocket terminsation and Durable Object will close it. Immediately after that the following error in the console will get logged:

```
[mf:err] Unhandled Promise Rejection: TypeError: WebSocket already closed
    at WebSocket.[kClose] (/data/projects/miniflare-debug-example/node_modules/@miniflare/web-sockets/src/websocket.ts:172:30)
    at WebSocket.close (/data/projects/miniflare-debug-example/node_modules/@miniflare/web-sockets/src/websocket.ts:161:10)
    at e.clearSocket (/data/projects/miniflare-debug-example/app/objects/dist/index.mjs:1:117)
    at /data/projects/miniflare-debug-example/app/objects/dist/index.mjs:1:640
    at /data/projects/miniflare-debug-example/node_modules/@miniflare/shared/src/event.ts:29:9
    at /data/projects/miniflare-debug-example/node_modules/@miniflare/shared/src/sync/gate.ts:176:11
```