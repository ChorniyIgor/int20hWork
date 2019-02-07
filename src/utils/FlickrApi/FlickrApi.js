class FlickrApi {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  getPhotosByHash(hash) {
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${
      this.apiKey
    }&text=%23${hash}&per_page=1000&format=json&nojsoncallback=1`;

    return fetch(url)
      .then(data => {
        return data.json();
      })
      .then(data => {
        return data.photos.photo;
      });
  }

  getFotosFromAlbom(albomId) {
    const url = ` https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${
      this.apiKey
    }&photoset_id=${albomId}&format=json&nojsoncallback=1`;

    return fetch(url)
      .then(data => {
        return data.json();
      })
      .then(data => {
        return data.photoset.photo;
      });
  }
}

const apiKey = `fd104a57e53d9d8c36669a070a45edce`;
const apiSecret = `2657ed0d04054ba6`;
export default new FlickrApi(apiKey, apiSecret);
