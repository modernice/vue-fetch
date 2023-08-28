import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toRef } from '@vueuse/shared'
import { computed } from '@vue/runtime-core'

/**
 * Generates a computed object with an `Authorization` attribute based on the
 * given token. If the token is present, it is prefixed with 'Bearer ' for use
 * in HTTP Authorization headers. The token can be a static string, a Ref, or a
 * getter function. Uses functions from {@link @vueuse/shared} and {@link
 * @vue/runtime-core}.
 */
export function bearerAuth(token: MaybeRefOrGetter<string>) {
  const _token = toRef(token)

  return computed(() => ({
    Authorization: _token.value ? `Bearer ${_token.value}` : '',
  }))
}
