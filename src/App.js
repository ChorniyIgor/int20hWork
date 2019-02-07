import React, { Component } from "react";
import "./App.css";
import Preloader from "./components/Preloader/Preloader";
import Error from "./components/ErrorScreen/Error";
import Menu from "./components/Menu/Menu";
import Flickr from "./utils/FlickrApi/FlickrApi";
import FACEPP from "./utils/FaceCognitiveServicesApi/facepp_sdk";
import Slider from "./components/Slider/Slider";

class App extends Component {
  constructor(props) {
    super(props);
    this.FLICKR = {
      ALBOM_ID: `72157674388093532`,
      HASHTEGS: `int20h`
    };
    this.FACEPP_DELAY_TIME = 500; //Затримка між запитами до Face++, в мс
    this.state = {
      preloader: true,
      isError: false,
      actualImgAlbom: new Set(),
      actualEmotinName: ``
    };

    this.photosUrlSet = new Set();
    this.photosWithResults = [];

    this.emotions = {
      anger: [],
      disgust: [],
      fear: [],
      happiness: [],
      neutral: [],
      sadness: [],
      surprise: []
    };

    this.downloadDataFromFlickr()
      .then(() => {
        console.log(`Усього знайдено унікальних ${[...this.photosUrlSet].length} фото`);
        return this.checkPhotosFasePlusPlus();
      })
      .then(() => {
        console.log(`Результат розпізнавання облич: `, this.photosWithResults);
        this.filteringEmotions();
        console.log(`Результат фільтрації емоцій: `, this.emotions);
        this.setState({
          preloader: false,
          actualImgAlbom: this.emotions.neutral,
          actualEmotinName: `neutral`
        });
      })
      .catch(err => {
        console.error(`Error:`, err);
        this.setState({
          isError: true
        });
      });
  }

  downloadDataFromFlickr() {
    const FlickrApi = Flickr;

    const imgFromAlbom = new Promise((resolve, reject) => {
      FlickrApi.getFotosFromAlbom(this.FLICKR.ALBOM_ID).then(photos => {
        console.log(`У альбомі ${this.FLICKR.ALBOM_ID} знайдено ${photos.length} фото`);
        photos.forEach(photo => {
          this.photosUrlSet.add(
            `http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${
              photo.secret
            }.jpg`
          );
        });
        resolve();
      });
    });

    const imgByHash = new Promise((resolve, reject) => {
      FlickrApi.getPhotosByHash(this.FLICKR.HASHTEGS).then(photos => {
        console.log(`По хештегу #${this.FLICKR.HASHTEGS} знайдено ${photos.length} фото`);
        photos.forEach(photo => {
          this.photosUrlSet.add(
            `http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${
              photo.secret
            }.jpg`
          );
        });
        resolve();
      });
    });

    return Promise.all([imgFromAlbom, imgByHash]);
  }

  checkPhotosFasePlusPlus() {
    function IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    const photoUrl = [...this.photosUrlSet];
    const promises = [];
    let count = 0;
    for (let i = 0; i < photoUrl.length; i++) {
      const promise = this._checkPhoto(photoUrl[i], i * this.FACEPP_DELAY_TIME).then(data => {
        this.showPreloaderPersent(count++);
        if (IsJsonString(data)) {
          this.photosWithResults[i] = { url: photoUrl[i], res: JSON.parse(data) };
        } else {
          this.photosWithResults[i] = { url: photoUrl[i], res: { faces: [] } }; //заглушка на випадок коли із серверу приходить не валідний JSON
        }
      });
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  filteringEmotions = () => {
    const results = this.photosWithResults;

    results.forEach(item => {
      if (item.res.faces.length > 0) {
        //якщо в результаті є обличчя
        item.res.faces.forEach(face => {
          //для кожного знайденого обличчя на фото
          if (face.attributes !== undefined) {
            //якщо у нього є атрибути
            Object.keys(face.attributes.emotion).forEach(emotion => {
              //для кожної емоції перевірка
              const emotionValue = face.attributes.emotion[emotion];
              if (emotionValue > 50) {
                //якщо відсоток у емоції більше 50
                this.emotions[emotion].push(item.url); //то додати фото до списку із відповідними емоціями
              }
            });
          }
        });
      }
    });
  };

  render = () => {
    let App = ``;
    if (!this.state.isError) {
      if (this.state.preloader) {
        App = <Preloader />;
      } else {
        App = (
          <div className="App">
            <Menu
              showPhotoEmotions={this.showPhotoWithEmotion}
              activeEmotionName={this.state.actualEmotinName}
            />
            <Slider photoUrls={this.state.actualImgAlbom} />
          </div>
        );
      }
    } else {
      App = <Error />;
    }

    return App;
  };

  _checkPhoto(url, time) {
    const param = {
      image_url: url,
      return_attributes: `emotion`
    };
    return FACEPP.detectFace(param, time);
  }

  showPhotoWithEmotion = emotionName => {
    this.setState({
      actualImgAlbom: new Set(this.emotions[emotionName]),
      actualEmotinName: emotionName
    });
  };

  showPreloaderPersent(val) {
    const length = [...this.photosUrlSet].length;
    const element = document.querySelector(".LoadingPercentages");
    if (this.state.preloader && !this.state.isError) {
      const pers = ((val / length) * 100).toFixed(2);
      element.innerHTML = pers + `%`;
    }
  }
}

export default App;
