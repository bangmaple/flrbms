import {NextApiRequest, NextApiResponse} from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Set-Cookie', [
    'accessToken=deleted; Max-Age=0; path=/',
  ]);

  res.writeHead(302, {
    Location: '/login'
  });
  res.end();
}
