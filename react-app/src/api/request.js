const baseUrl = "/api"

const localAuth = () => {
  return JSON.parse(localStorage.getItem("auth") || "{}")
}

const request = async (key, options = {}) => {
  const { url, method, authorization, searchParams } = key
  const { bodyHandler, responseHandler } = options
  const defaultHeaders = options.headers
    ? options.headers
    : {
        "Content-Type": "application/json",
      }
  const auth = localAuth()
  let token = auth?.state?.auth?.accessToken
  if (token) {
    if (authorization === "refreshToken") {
      token = auth?.state?.auth?.refreshToken
    }
    defaultHeaders["authorization"] = `Bearer ${token}`
  }

  const requestOptions = {
    method: !!method ? method : "GET",
    headers: defaultHeaders,
    body: bodyHandler
      ? bodyHandler(options.body)
      : JSON.stringify(options.body),
  }

  const searchStr = !!searchParams?.toString()
    ? "?" + searchParams.toString()
    : ""
  const input = `${baseUrl}${url}` + searchStr

  try {
    const response = await fetch(input, requestOptions)
    if (response.status === 401) {
      const error = new Error("An error occurred, token has expired.")
      error.info = await response.json()
      error.status = response.status
      throw error
    }
    if (responseHandler) {
      return responseHandler(response)
    }
    return response.json()
  } catch (error) {
    console.log("Request Failed", error)
    throw error
  }
}

export default request
