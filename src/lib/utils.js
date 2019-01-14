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

function getCharacterEncoding(headers) {
  let charset = headers
    .get("Content-Type")
    .split(";")
    .filter(header => header.includes("charset"))[0];
  return charset ? charset.split("=")[1] : Constants.DEFAULT_CHARACTER_ENCODING;
}

function decodeBuffer(buffer, encoding) {
  // From https://schneide.blog/2018/08/08/decoding-non-utf8-server-responses-using-the-fetch-api/
  let decoder = new TextDecoder(encoding);
  return decoder.decode(buffer);
}

export { decodeBuffer, darkModeEnabled, getCharacterEncoding };
