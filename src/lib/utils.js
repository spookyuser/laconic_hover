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

function decodeBuffer(buffer) {
  // From https://schneide.blog/2018/08/08/decoding-non-utf8-server-responses-using-the-fetch-api/
  console.log("decoding");
  let decoder = new TextDecoder("iso-8859-1");
  let text = decoder.decode(buffer);
  return text;
}

export { decodeBuffer, darkModeEnabled };
