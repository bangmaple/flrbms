import axios, {AxiosError} from "axios";

axios.interceptors.request.use(async (request) => {
  return request;
});

axios.interceptors.response.use(async (response) => {
  console.log(response);

  return Promise.resolve(response);
}, async (error: AxiosError) => {
  const statusCode = error.response.status;
  console.log(statusCode);
  if (statusCode === 401) {
    window.location.href = '/login';
  }
  return Promise.reject(error);
});
