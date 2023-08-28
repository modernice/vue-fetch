import type { MaybeRefOrGetter } from '@vueuse/core'
import { toRef } from '@vueuse/core'
import type { Ref } from '@vue/runtime-core'
import { computed } from '@vue/runtime-core'
import { $fetch, Headers } from 'ofetch'
import type {
  FetchError,
  FetchRequest,
  FetchOptions as OFetchOptions,
} from 'ofetch'
import { readonly } from '@vue/reactivity'
import type { OFetchMappedType, OFetchResponseType } from './ofetch'

const defaultBaseHeaders = {
  'Content-Type': 'application/json' as const,
} satisfies HeadersInit

export type FetchAuth = MaybeRefOrGetter<HeadersInit>

export interface FetchOptions {
  baseUrl?: MaybeRefOrGetter<string>
  headers?: MaybeRefOrGetter<HeadersInit | null | undefined>
  auth?: FetchAuth
  parseError?: (error: FetchError) => string | Error
}

export function defineFetch(options?: FetchOptions) {
  const baseUrl = readonly(toRef(options?.baseUrl))

  const baseHeaders = toRef(
    options?.headers ?? { ...defaultBaseHeaders },
  ) as Ref<HeadersInit>

  const authHeadersInit = toRef(options?.auth) as Ref<
    HeadersInit | null | undefined
  >

  const headers = computed(() => {
    const headers = new Headers({ ...baseHeaders.value })

    if (authHeadersInit.value) {
      new Headers(authHeadersInit.value).forEach((value, key) =>
        headers.set(key, value),
      )
    }

    return headers
  })

  function createFetch() {
    return $fetch.create({
      baseURL: baseUrl.value,
      headers: headers.value,
    })
  }

  return () => {
    const fetch: FetchFn = async (request, opts) => {
      try {
        return await createFetch()(request, opts)
      } catch (e) {
        throw options?.parseError ? options.parseError(e as FetchError) : e
      }
    }

    return {
      fetch,
    }
  }
}

export type FetchFn = <T = any, R extends OFetchResponseType = 'json'>(
  request: FetchRequest,
  options?: OFetchOptions<R>,
) => Promise<OFetchMappedType<R, T>>
