import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

const NextHealthCheckAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.get(`${process.env.API_URL}/health/auth`, {
      headers: {
        Authorization: `Bearer ${req.body}`
      }
    });
    res.status(200);

  } catch (e: AxiosError | any) {

    const response = e.response.status;
    if (response >= 400 && response < 500) {
      res.status(401);
    }

  } finally {
    res.end();
  }
  return {
    props: {}
  };
};

export default NextHealthCheckAuth;
