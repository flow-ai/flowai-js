const COOKIES_EXP_MS = 604800000

/**
 * 
 * @param {string} name 
 * @param {string} value 
 */
const setCookie = (name, value) => {
  document.cookie = `${encodeURIComponent(name)}=${value};expires=${new Date(Date.now() + COOKIES_EXP_MS)}`
}
/**
 * 
 * @param {string} name 
 * @returns {string}
 */
const getCookie = name => {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    if (cookie.trim().startsWith(encodeURIComponent(name))) {
      return cookie.split('=')[1]
    }
  }
}

export {
  setCookie,
  getCookie
}