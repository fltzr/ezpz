export const getCookie = (cookieName: string) => {
  const documentCookies = document.cookie.split('; ');

  for (const cookie of documentCookies) {
    const [key, value] = cookie.split('=');

    if (key === cookieName) {
      return decodeURIComponent(value);
    }
  }

  return undefined;
};
