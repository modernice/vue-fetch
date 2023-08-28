# vue-fetch

`vue-fetch` lets you define and reuse fetch composables seamlessly within your Vue apps. Built on top of [ofetch](unjs/ofetch).

## Installation

```bash
npm i @modernice/vue-fetch
```

```bash
pnpm i @modernice/vue-fetch
```

```bash
yarn add @modernice/vue-fetch
```

> Note: Make sure [ofetch](unjs/ofetch) is also installed in your project as it is a peer-dependency of `vue-fetch`.

## Example: Nuxt 3

1. Define your fetch composable:

```ts
// composables/useFetch.ts
import { defineFetch, bearerAuth } from '@modernice/vue-fetch'

// Obtain your authentication token, for example, from @nuxtjs/auth
const authToken = ref('...')

export const useApi = defineFetch({
	baseUrl: 'http://api.example.test',
	headers: {},  // Set default headers for every request here
	auth: bearerAuth(authToken),  // Automatically adds "Authorization" header to every request
})
```

2. Use in any part of your app

```vue
// pages/foo.vue
<script setup>
const { fetch } = useApi()
const data = await fetch('/foo')
</script>
```

## License

[MIT License](./LICENSE)
