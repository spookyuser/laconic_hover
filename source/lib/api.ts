import { DEFAULT_CHARACTER_ENCODING } from "../config";

/** Fetches a page from tvtropes
  When parsing the fetch Response object, we don't use
 * the .text() function as this is encodes the html in UTF-8 even
 * though this is not always the case. So, instead we now use
 * .arrayBuffer() and then manually encode the text
 *
 * @see decodeBuffer
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 */
export async function fetchPage(url: string): Promise<Document> {
  // Fetch the page AND follow redirects
  const response = await fetch(url, { redirect: "follow" });
  if (response.ok) {
    const decoded = decodeBuffer(
      await response.arrayBuffer(),
      getCharset(response.headers)
    );
    const parser = new DOMParser();
    return parser.parseFromString(decoded, "text/html");
  } else {
    throw new Error("No laconic page found");
  }
}

/** Given a response.headers object find the charset contained in its content type
 * or return a default charset
 * Because we can't always assume tvtropes will be encoded using ISO-8859-1
 * @example"text/html; charset=ISO-8859-1" // returns "ISO-8859-1"
 */
function getCharset(headers: Headers) {
  const charset = headers
    .get("Content-Type")!
    .split(";")
    .find((header: string | string[]) => header.includes("charset"));
  return charset ? charset.split("=")[1] : DEFAULT_CHARACTER_ENCODING;
}

/** Manually decode an ArrayBuffer with a specific charset
 *
 * This is instead of using response.text() which only returns
 * utf-8. Since tvtropes isn't utf-8 we manually decode the
 * response.ArrayBuffer() here
 *
 * From schneide.blog
 * @see https://schneide.blog/2018/08/08/decoding-non-utf8-server-responses-using-the-fetch-api/
 */
function decodeBuffer(
  buffer: BufferSource | undefined,
  charset: string | undefined
): string {
  const tryDecode = () => {
    try {
      return new TextDecoder(charset);
    } catch (error) {
      return new TextDecoder('UTF-8');
    }
  }
  const decoder = tryDecode();
  return decoder.decode(buffer);
}
