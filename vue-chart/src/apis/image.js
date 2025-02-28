import api from '@/utils/api'

export default {
  checkServerStatus: () => {
    return api({
      url: "api/status",
      method: "get"
    })
  },
  startImageUpscale: (formData) => {
    return api({
      url: "api/start-upscale",
      method: "post",
      data: formData,
      headers: {
        'content-type': "multipart/form-data"
      }
    })
  }
}