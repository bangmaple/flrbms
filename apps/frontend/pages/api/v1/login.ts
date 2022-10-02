import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface Credential {
  username: string;
  password: string;
}

const NextLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST" || !req.body) {
    res.writeHead(400);
    res.end();
    return;
  }
  const credentials = req.body as Credential;

  try {
    const response = await axios.post(`${process.env.API_URL}/auth/signin`, {
      username: credentials.username,
      password: credentials.password
    });
    const body = await response.data;

    const accessToken = response.headers["authorization"];
    const refreshToken = response.headers["authorizationrefreshtoken"];

    res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; Max-Age=999999; HttpOnly; path=/`,
      `refreshToken=${refreshToken}; Max-Age=999999; HttpOnly; path=/`
    ]);
    res.json(body);
  } catch (e) {
    res.statusCode = 401;

    res.json(e.response.data);
  } finally {
    res.end();

  }
};

export default NextLogin;
