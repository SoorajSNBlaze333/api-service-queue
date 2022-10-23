import axios from 'axios';

class API {
  static current_queue = [];
  static pendingPromise = false;
  static http = axios;

  constructor() {
    API.http.interceptors.response.use(this.onSuccess, this.onError);
  }

  static queue(promise) {
    return new Promise((resolve, reject) => {
      API.current_queue.push({
        promise,
        resolve,
        reject,
      });
      API.dequeue();
    });
  }

  static dequeue() {
    if (this.workingOnPromise) {
      return false;
    }
    const item = API.current_queue.shift();
    if (!item) {
      return false;
    }
    try {
      this.workingOnPromise = true;
      item.promise()
        .then((value) => {
          this.workingOnPromise = false;
          item.resolve(value);
          API.dequeue();
        })
        .catch(err => {
          this.workingOnPromise = false;
          item.reject(err);
          API.dequeue();
        })
    } catch (err) {
      this.workingOnPromise = false;
      item.reject(err);
      API.dequeue();
    }
    return true;
  }

  static onSuccess(response) {
    return response.data;
  }

  static onError(error) {
    Promise.reject(error);
  }

  static debug() {
    return new Promise((res) => setTimeout(
      () => res("Completed")
    , 2000))
  }

  static get(url = '', options = {}) {
    return this.http.get(url, options)
  }

  static post(url = '', data = {}, options = {}) {
    return this.http.post(url, data, options)
  }

  static postWithFiles(url = '', data = {}, options = {}) {
    return this.http.post(url, data, { ...options, headers: { ...options.headers, 'Content-Type': 'multipart/form-data' }})
  }

  static put(url = '', options = {}) {
    return this.http.put(url, options)
  }

  static delete(url = '', options = {}) {
    return this.http.delete(url, options)
  }
}

const api = new API();

const queuedAPI = {
  // queue: API.current_queue.length, TODO fix this
  get(url = '', options = {}) {
    return API.queue(() => API.get(url, options));
  }
}

export default queuedAPI;