import axios from 'axios';

class API {
  static current_queue = [];
  static pendingPromise = false;
  static http = axios;
  static retryTimeout = null;

  constructor() {
    // API.http.interceptors.response.use(this.onSuccess, this.onError);
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

  static retry() {
    clearTimeout(API.retryTimeout);
    console.log("Trying to connect to the internet!");
    API.retryTimeout = setTimeout(() => API.dequeue(), 2000);
  }

  static afterPromise = (item, resolve = false, data) => {
    this.workingOnPromise = false;
    if (resolve) item.resolve(data);
    else item.reject(data);
    API.dequeue();
  }

  static dequeue() {
    if (this.workingOnPromise) {
      return false;
    }
    if (window.navigator && !window.navigator.onLine) {
      return API.retry();
    }
    const item = API.current_queue.shift();
    if (!item) {
      return false;
    }
    try {
      this.workingOnPromise = true;
      item.promise()
        .then((value) => API.afterPromise(item, true, value))
        .catch((error) => API.afterPromise(item, false, error))
    } catch (error) {
      API.afterPromise(item, false, error);
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

  static request(options) {
    return this.http(options).then((data) => API.onSuccess(data)).catch((error) => API.onError(error));
  }
}

new API();

const queuedAPI = {
  /* Debug */
  debug() {
    return API.queue(() => API.debug());
  },
  /* Debug */
  get(url = '', options = {}) {
    return API.queue(() => API.request({ method: 'get', url, ...options }));
  },
  post(url = '', options = {}) {
    return API.queue(() => API.request({ method: 'post', url, ...options }));
  },
  put(url = '', options = {}) {
    return API.queue(() => API.request({ method: 'put', url, ...options }));
  },
  delete(url = '', options = {}) {
    return API.queue(() => API.request({ method: 'delete', url, ...options }));
  }
}

export default queuedAPI;