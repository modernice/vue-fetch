export interface OFetchResponseMap {
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
  stream: ReadableStream<Uint8Array>
}

export type OFetchResponseType = keyof OFetchResponseMap | 'json'

export type OFetchMappedType<
  R extends OFetchResponseType,
  JsonType = any,
> = R extends keyof OFetchResponseMap ? OFetchResponseMap[R] : JsonType
