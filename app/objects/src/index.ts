export { List } from './list'

export default {
  async fetch() {
    try {
      return await handleRequest()
    } catch (e) {
      return new Response(`${e}`)
    }
  }
}

async function handleRequest() {
  return new Response('This Worker is not meant to be called directly', {
    status: 400
  })
}
