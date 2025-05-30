import type { MaybeRefOrGetter } from '@vueuse/core'
import { toRef, toValue } from '@vueuse/core'
import type { Ref } from '@vue/runtime-core'
import { computed, ref, watch } from '@vue/runtime-core'
import _, { $fetch, Headers } from 'ofetch'
import type {
  FetchError,
  FetchRequest,
  MappedResponseType,
  FetchOptions as OFetchOptions,
  ResponseType,
} from 'ofetch'

// import type { OFetchMappedType, OFetchResponseType } from './ofetch'

const defaultBaseHeaders = {
  'Content-Type': 'application/json' as const,
} satisfies HeadersInit

/**
 * FetchAuth is a type that represents a function or reference to a {@link
 * HeadersInit} object, which can be used to provide authorization headers for
 * HTTP fetch requests. It can be utilized in {@link FetchOptions} to customize
 * the authorization headers for each fetch request made using the defined fetch
 * function.
 */
export type FetchAuth = MaybeRefOrGetter<HeadersInit>

/**
 * FetchOptions is an interface that provides configuration options for the
 * fetch operation. It allows customization of the base URL, headers,
 * authorization, and error parsing. The `baseUrl` property specifies the base
 * URL for the fetch request. The `headers` property allows setting custom
 * headers for the request. The `auth` property provides an option to define
 * authorization headers. The `parseError` function can be used to customize how
 * fetch errors are handled and formatted.
 */
export interface FetchOptions<TError extends Error = FetchError> {
  /**
   * The `baseUrl` property of `FetchOptions` is an optional reference or getter
   * function that returns a string. It defines the base URL for all fetch
   * requests made using the fetch function defined by `defineFetch()`. This can
   * be particularly useful when making multiple requests to the same domain, as
   * it reduces code repetition. If left undefined, fetch requests will need to
   * specify the full URL individually.
   */
  baseUrl?: MaybeRefOrGetter<string>

  /**
   * Specifies the headers to be sent with the fetch request. This property
   * allows customization of the headers for each request, which can be useful
   * for setting authentication tokens or other necessary request information.
   * The value can either be a static object or a function returning an object.
   * If no headers are provided, default headers will be used. Note that this is
   * a nullable property and can be undefined or null.
   */
  headers?: MaybeRefOrGetter<HeadersInit | null | undefined>

  /**
   * The `auth` property of `FetchOptions` represents the authentication headers
   * that can be used when making a fetch request. It accepts a value of type
   * `FetchAuth`, which is a reference or getter for the headers. These headers
   * are used to authenticate the client making the request, typically by
   * including credentials such as tokens or keys. If provided, these headers
   * are merged with any base headers already defined in the fetch options.
   */
  auth?: FetchAuth

  /**
   * This property is an optional function that takes a {@link FetchError} as
   * its argument. If provided, it will be used to parse errors that occur
   * during fetch operations. The parsed error, which should be returned as a
   * string or an instance of {@link Error}, will then be thrown instead of the
   * original error. This allows for more flexible and custom error handling
   * within the context of {@link FetchOptions}.
   */
  parseError?: (error: FetchError) => TError

  onError?: (error: TError) => void
}

/**
 * This function `defineFetch()` is used to set up an HTTP fetch operation with
 * a set of optional configurations. These options may include custom base URL,
 * headers, authentication details, and error parsing logic. The function
 * returns another function which when invoked, creates a fetch instance with
 * the defined configurations and performs the fetch operation. If an error
 * occurs during the fetch operation, it either throws the error as is or parses
 * it based on the provided error parsing logic.
 */
export function defineFetch(options?: FetchOptions) {
  const baseUrl = ref(toValue(options?.baseUrl ?? ''))
  const optsHeaders = toRef(
    options?.headers ?? { ...defaultBaseHeaders },
  ) as Ref<HeadersInit>
  const authHeadersInit = toRef(options?.auth) as Ref<
    HeadersInit | null | undefined
  >
  const customHeaders = ref(new Headers())

  function setBaseUrl(url: string) {
    baseUrl.value = url
  }

  if (options?.baseUrl) {
    watch(
      () => toValue(options.baseUrl),
      (url) => setBaseUrl(url ?? ''),
    )
  }

  const headers = computed(() => {
    const headers = new Headers({ ...optsHeaders.value })

    if (authHeadersInit.value) {
      new Headers(authHeadersInit.value).forEach((value, key) =>
        headers.set(key, value),
      )
    }

    customHeaders.value.forEach((value, key) => headers.set(key, value))

    return headers
  })

  return () => {
    function createFetch(options?: { headers?: HeadersInit }) {
      return $fetch.create({
        baseURL: baseUrl.value,
        headers: options?.headers ?? headers.value,
      })
    }

    const fetch: FetchFn = async (request, opts) => {
      try {
        return await createFetch()(request, opts)
      } catch (e) {
        const err = options?.parseError
          ? options.parseError(e as FetchError)
          : (e as FetchError)

        options?.onError?.(err)

        throw err
      }
    }

    return {
      fetch,
      createFetch,
      customHeaders,
      headers,
      setBaseUrl,
    }
  }
}

/**
 * FetchFn is a generic function type that represents a fetch operation. It
 * takes a request of type {@link FetchRequest} and optionally an options object
 * of type {@link OFetchOptions}. The function returns a Promise which resolves
 * with the fetched data, mapped according to the specified response type. The
 * type of data and response can be specified through the generic parameters T
 * and R, respectively. By default, T is any and R is 'json'.
 */
export type FetchFn = <TJsonType = any, R extends ResponseType = 'json'>(
  request: FetchRequest,
  options?: OFetchOptions<R>,
) => Promise<MappedResponseType<R, TJsonType>>
