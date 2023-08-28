/**
 * OFetchResponseMap represents a mapping of response types that can be returned
 * by the OFetch function. It includes the following properties: blob, text,
 * arrayBuffer, and stream. The values of these properties correspond to the
 * respective response types. This interface is used in conjunction with
 * OFetchResponseType to define the possible response types that can be handled
 * by OFetch. The OFetchMappedType type is a conditional type that maps a given
 * OFetchResponseType to its corresponding response type in OFetchResponseMap,
 * or falls back to a generic JsonType if the response type is 'json'.
 */
export interface OFetchResponseMap {
  /**
   * The "blob" property of OFetchResponseMap represents a binary large object.
   * It is used to store and retrieve binary data within the context of
   * OFetchResponseMap.
   */
  blob: Blob
  /**
   * The `text` property of `OFetchResponseMap` is used to store the textual
   * response data obtained from a fetch request within the context of
   * `OFetchResponseMap`. It represents the content of the response as a string.
   */
  text: string
  /**
   * The `arrayBuffer` property of `OFetchResponseMap` represents the response
   * data as an `ArrayBuffer`. It is used within the context of
   * `OFetchResponseMap` to provide access to the response data in a binary
   * format.
   */
  arrayBuffer: ArrayBuffer
  /**
   * The `stream` property of `OFetchResponseMap` represents a readable stream
   * that contains a sequence of `Uint8Array` chunks. It is used to access and
   * process the data in a streaming manner within the context of
   * `OFetchResponseMap`.
   */
  stream: ReadableStream<Uint8Array>
}

/**
 * OFetchResponseType represents the type of response that can be obtained from
 * a fetch request. It can be one of the keys of OFetchResponseMap or the string
 * 'json'. The keys in OFetchResponseMap represent different types of responses
 * such as blob, text, arrayBuffer, and stream. OFetchMappedType is a utility
 * type that maps the specified OFetchResponseType to its corresponding response
 * type in OFetchResponseMap or to the generic JsonType if the specified
 * OFetchResponseType is 'json'.
 */
export type OFetchResponseType = keyof OFetchResponseMap | 'json'

/**
 * OFetchMappedType is a conditional type that maps a given OFetchResponseType
 * to the corresponding response type. If the provided OFetchResponseType is one
 * of the keys in the OFetchResponseMap, then the corresponding value type from
 * the map is returned. Otherwise, the JsonType is returned as the default
 * response type.
 */
export type OFetchMappedType<
  R extends OFetchResponseType,
  JsonType = any,
> = R extends keyof OFetchResponseMap ? OFetchResponseMap[R] : JsonType
