import axios from 'axios'

axios.defaults.headers = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": '*',
  "Access-Control-Allow-Credentials": "true",
}

const instance = axios.create({
  // baseURL: API_BASE_URL,
  // timeout: 1000 * 1,
  timeout: 1000 * 30
})

// instance.interceptors.request.use(
//   (config) => {
//     return config; // 수정된 config 반환
//   },
//   (error) => {
//     // 요청 오류 처리
//     return Promise.reject(error);
//   }
// );

instance.interceptors.response.use(
  function (response) {
    return response;
  },

  async function (error) {
    if (error.response && error.response.status) {
      let serverError = error.response?.data;

      if (serverError && serverError instanceof Blob) {
        serverError = JSON.parse(await serverError.text());
      }
      // 공통 에러 처리 영역
      
      switch (error.response.status) {
        case 401:
        case 403: 
        case 500:
        case 501:
        case 502:
        case 504:
        case 503: {
          // toastNotify(`오류가 발생하였습니다. :: ${error?.message}`, { type: "error" });
          break;
        }
        default: {
          break;
        }
        // case 400: // [Bad Request]
        //   break
        // case 404: // [Not Found]
        //   break
        // case 405: // [Method Not Allowed]
        //   break
        // case 409: // [Conflict]
        //   break
        // case 429: // [Too Many Requests]
        //   break
      }
    } else if (error.name === "AxiosError") {
      toastNotify(`오류가 발생하였습니다. :: ${error?.message}`, { type: "error" });
    }
    return Promise.reject(error);
  }
);

export default instance