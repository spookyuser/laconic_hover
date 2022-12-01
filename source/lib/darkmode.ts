import { DARK_MODE_COOKIE } from "../config";

export function darkModeEnabled(): boolean {
  return (
    document.cookie.split(";").filter((item) => item.includes(DARK_MODE_COOKIE))
      .length > 0
  );
}
