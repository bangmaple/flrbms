import axios from "axios";

export const API_URL = {
  user: {
    login: '/api/auth/signin'
  }
}

interface AxiosPostModel {
  url: string;
  body: any;
}



export const axiosPost = async (payload: AxiosPostModel) => {
  const response = await axios.post(payload.url, payload.body, {
    headers: {
      'Media-Type': 'application/json; charset=utf-8',
    },
    method: 'POST',
  });
  return response;
}
