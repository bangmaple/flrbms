export const getAccessTokenViaCookie = (request) => request.headers["cookie"]?.split(";")
  .map(k => k.trim()).find(k => k.startsWith("accessToken="))?.split("=")[1] ?? "";
