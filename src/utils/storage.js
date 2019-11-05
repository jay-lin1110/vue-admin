const { localStorage: storage } = window

const Storage = {
  get: key => storage.getItem(key),

  set(key, value) {
    storage.setItem(key, value)
  },

  remove(key) {
    storage.removeItem(key)
  }
}

export default Storage

// localStorage存取格式必须为json格式的字符串
// localStorage.setItem(key, JSON.stringify(value))
// JSON.parse(localStorage.getItem(key) || '[]')
