import Constants from "./constants";

function darkModeEnabled() {
  if (
    document.cookie
      .split(";")
      .filter(item => item.includes(Constants.DARK_MODE_COOKIE)).length > 0
  )
    return true;
  return false;
}

/** Given a response.headers object find the charset contained in its content type
 * or return a default charset
 *
 * Because we can't always assume tvtropes will be encoded using ISO-8859-1
 *
 * @param {Response.headers} headers A Response.headers object
 * @returns {String} A charset string found in the headers object or a default
 *
 * @example"text/html; charset=ISO-8859-1" // returns "ISO-8859-1"
 */
function getCharset(headers) {
  let charset = headers
    .get("Content-Type")
    .split(";")
    .filter(header => header.includes("charset"))[0];
  return charset ? charset.split("=")[1] : Constants.DEFAULT_CHARACTER_ENCODING;
}

/** Manually decode an ArrayBuffer with a specific charset
 *
 * This is instead of using response.text() which only returns
 * utf-8. Since tvtropes isn't utf-8 we manually decode the
 * response.ArrayBuffer() here
 *
 * From schneide.blog
 *
 * @see https://schneide.blog/2018/08/08/decoding-non-utf8-server-responses-using-the-fetch-api/
 *
 * @returns {String} A string of the ArrayBuffer once decoded
 * @param {ArrayBuffer} buffer
 * @param {String} charset A charset string e.g: "ISO-8859-1"
 */
function decodeBuffer(buffer, charset) {
  let decoder = new TextDecoder(charset);
  return decoder.decode(buffer);
}

export { decodeBuffer, darkModeEnabled, getCharset };
