const FACE_HOST_CN = "https://api-cn.faceplusplus.com/";
const FACE_HOST_US = "https://api-us.faceplusplus.com/";

const FACE_FACEPP = "facepp/v3/";
const FACE_DETECT = FACE_FACEPP + "detect";

class FACEPP {
  constructor(apikey, apisecret, isChina) {
    this.apikey = apikey;
    this.apisecret = apisecret;
    this.isChina = isChina;
    if (isChina) {
      this.baseurl = FACE_HOST_CN;
    } else {
      this.baseurl = FACE_HOST_US;
    }
  }

  detectFace(param, time) {
    var url = this.baseurl + FACE_DETECT;

    return this.request(url, param, time);
  }

  request(url, dic, time) {
    const formData = new FormData();

    formData.append("api_key", this.apikey);
    formData.append("api_secret", this.apisecret);

    for (var key in dic) {
      formData.append(key, dic[key]);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState !== 4) return;

          if (xhr.status !== 200) {
            resolve(xhr.response); //для ігнорування помилок із Face++ через велику кількість запитів
          } else {
            resolve(xhr.response);
          }
        };

        xhr.send(formData);
      }, time);
    });
  }
}

const apiKey = `SyhPegx52K9dpYQcQMlBH4NSPQvUqhvk`;
const apiSecret = `2OW4e8v9cqeNlpmjmH4hF4DyujOSVUxM`;

export default new FACEPP(apiKey, apiSecret, false);
