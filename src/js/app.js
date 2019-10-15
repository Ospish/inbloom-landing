

// Конфиги для  fetch
var fetchGetConf = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};
var API_SERVER = 'https://api.inbloomshop.ru/public';
//Проверяем есть ли каталог на странице
var hasCatalog = document.getElementById('catalog')



var result;

window.onload = function() {
  // Если функциональность геолокации доступна,
  // пытаемся определить координаты посетителя
  if (localStorage.getItem('addrStr').length < 5) {
    if (navigator.geolocation) {
      // Передаем две функции
      navigator.geolocation.getCurrentPosition(
          geolocationSuccess, geolocationFailure);

      // Выводим результат
      console.log("Поиск начался");
    }
    else {
      // Выводим результат
      console.log("Ваш браузер не поддерживает геолокацию");
    }
  }
};

function geolocationSuccess(position) {
  request = 'https://geocode-maps.yandex.ru/1.x/?format=json&apikey=51dd1116-29b8-4a97-ac52-d4d1197d0d80&geocode=' + position.coords.longitude + ", " + position.coords.latitude;
  return fetch(request, { method: 'GET' })
      .then(function(response) {
        console.log("Последний раз вас засекали здесь: ");
        return response.json().then(function(data) {
          var addrStr = data.response.GeoObjectCollection.featureMember[0].GeoObject.name + ', ' + data.response.GeoObjectCollection.featureMember[1].GeoObject.name + ', ' + data.response.GeoObjectCollection.featureMember[2].GeoObject.name;
          console.log(addrStr);
          localStorage.setItem('addrStr', addrStr)
        }).catch(function() {
          // В случае ошибки возвращаем пустой массив
          return [];
        });
      })
      .catch(function(error) {
        console.error(error);
      });
  }

function geolocationFailure(positionError) {
  console.log("Ошибка геолокации");
}

/**
 * Смена города в шапке
 * @type {Vue}
 */
var citySelect = new Vue({
  el: '#city-select',
  data: {
    cities: [],
    selectedIndex: false,
    showList: false
  },
  computed: {
    /**
     * Название выбранного города
     */
    city: function() {
      if (this.cities.length < 1) {

          return 'Москва';
      }
      if (this.selectedIndex == false) {
        return 'Москва';
      }
      return this.cities[this.selectedIndex];
    }
  },
  watch: {
    /**
     * Отслеживаем изменение индекса города (меняется при смене города в шапке)
     * @param value
     */
    selectedIndex: function(index) {
      city = this.cities[index];
      partnerInfo.getId(city);
    }
  },
  created: function () {
    // Получаем всем города и добавляем их в массив this.cities
    this.getCities();

    /* FETCH CODE
    this.getCities().then(function(cities) {
      citySelect.addCities(cities);
    });
     */

    setTimeout(function (){
      if (partnerInfo.id == null) {
        partnerInfo.getId('Москва');
      }
    }, 500);
  },
  methods: {
    init: function() {
    },
    /**
     * Получение городов
     */
      getCities: function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            citySelect.addCities(JSON.parse(xhttp.responseText))
          }
        };
        xhttp.open("GET",API_SERVER + "/api/user/cities",true);
        xhttp.send();

        /* FETCH CODE
        return fetch(API_SERVER + '/api/user/cities', fetchGetConf)
            .then(function(response) {
              return response.json().then(function(cities) {
                if (cities.length > 0) {
                  return cities;
                } else {
                  return [];
                }
              }).catch(function() {
                // В случае ошибки возвращаем пустой массив
                return [];
              });
            })
            .catch(function(error) {
              console.error(error);
            });
         */
      },
    /**
     * Добавление города
     * @param cities - массив с городами [{city: cityName}, {city: cityName}]
     */

    addCities: function(cities) {
      cities.forEach(function(element) {
        citySelect.cities.push(element.city);
      });

      console.log(localStorage.getItem('cityindex'));
      if (localStorage.getItem('cityindex') > citySelect.cities.length) {localStorage.removeItem('cityindex');}
      if ((localStorage.getItem('cityindex') != null) && (citySelect.selectedIndex != localStorage.getItem('cityindex'))) {
        citySelect.selectedIndex = localStorage.getItem('cityindex');
      }

    },
    /**
     * Смена города по индексу
     * @param index - индекс города в массиве this.cities
     */
    selectCity: function(index) {
      this.selectedIndex = index;

      localStorage.setItem('cityindex', index);


      this.showList = false;
    }
  }
});

contentInfo = new Vue({
  el: '#portfolio',
  data: {
    ids: [],
    urls: [],
    urls2: []
  },
  created: function () {
    this.getContent()
  },
  methods: {
    /**
     * Получение id контента
     */
    getContent: function() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var info = JSON.parse(xhttp.responseText);
          console.log(info);
          info.forEach(function (item) {
            contentInfo.ids.push(item.id);
            contentInfo.urls.push(API_SERVER + '/api/file/oneblob/content/' + item.id);
            contentInfo.urls2.push(API_SERVER + '/api/file/one/content/' + item.id);
          })
        }
      };
      xhttp.open("GET",API_SERVER + '/api/content',true);
      xhttp.send();
      /*
      return fetch(API_SERVER + '/api/content', fetchGetConf)
          .then(function(response) {
            return response.json().then(function(info) {
              info.forEach(function(item) {
                contentInfo.ids.push(item.id);
                contentInfo.urls.push(API_SERVER + '/api/file/oneblob/content/' + item.id);
                contentInfo.urls2.push(API_SERVER + '/api/file/one/content/' + item.id);
              })
            });
          })
          .catch(function(error) {
            console.error(error);
          });
      */
    }
  },
  /*
  watch: {
    urls: function(index) {
      contentInfo.urls[index] = ('http://.com/public/api/file/blob/content/' + item.id + '.jpg');
    }
  },
 */
});

/**
 * Информация о выбранном партнере
 * @type {Vue}
 */
partnerInfo = new Vue({
  el: '#header-contacts',
  data: {
    id: null,
    email: false,
    phone: false
  },
  methods: {
    /**
     * Получаем id партнера, у которого дольше всего не было заказа в этом городе
     * @param city - город партнера
     */
    getId: function(city) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var id = JSON.parse(xhttp.responseText);
          console.log('id' + id);
          if (id != null) {
            partnerInfo.id = id;
            partnerInfo.getInfo(id);
            socials.getSocials(id);
            /*
            if (hasCatalog) {
              catalog.getProductsById(id).then(function (products) {
                catalog.addProducts(products);
              });
            }
             */
            if (hasCatalog) {
              catalog.getProductsById(id);
            }
          }
        }
      };
      xhttp.open("GET", API_SERVER + '/api/user/city?city=' + city, true);
      xhttp.send();
      /*
     return fetch(API_SERVER + '/api/user/city?city=' + city, fetchGetConf)
      .then(function(response) {
        return response.json().then(function(id) {
          console.log('id' + id);
          if (id != null) {
            partnerInfo.id = id;
            partnerInfo.getInfo(id);
            socials.getSocials(id);
            if (hasCatalog) {
              catalog.getProductsById(id).then(function(products) {
                catalog.addProducts(products);
              });
            }
          }
        });
      })
      .catch(function(error) {
        console.error(error);
      });
       */
    },
    /**
     * Получение информации о партнере по id
     * @param id - id партнера
     */
    getInfo: function(id) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var info = JSON.parse(xhttp.responseText);
          if (info.length > 0) {
            partnerInfo.phone = info[0]['phone'] ? info[0]['phone'] : false;
            partnerInfo.email = info[0]['corp_email'] ? info[0]['corp_email'] : false;
          }
        }
      };
      xhttp.open("GET", API_SERVER + '/api/user/info/' + id, true);
      xhttp.send();
      /*
      return fetch(API_SERVER + '/api/user/info/' + id, fetchGetConf)
        .then(function(response) {
          return response.json().then(function(info) {
            if (info.length > 0) {
              partnerInfo.phone = info[0]['phone'] ? info[0]['phone'] : false;
              partnerInfo.email = info[0]['corp_email'] ? info[0]['corp_email'] : false;
            }
          });
        })
        .catch(function(error) {
          console.error(error);
        });
       */
    }
  }
});

/**
 * Социальные сети в футнере
 * @type {Vue}
 */
socials = new Vue({
  el: '#footer-socials',
  data: {
    active: false,
    list: false
  },
  methods: {
    /**
     * Получение социальных сетей по id партнера
     * @param id - id партнера
     */
    getSocials: function(id) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var list = JSON.parse(xhttp.responseText);
          if (list.length > 0) {
            socials.list = list[0][0];
            socials.active = list[1][0];
          }
        }
      };
      xhttp.open("GET", API_SERVER + '/api/user/socials/' + id, true);
      xhttp.send();
      /*
      return fetch(API_SERVER + '/api/user/socials/' + id, fetchGetConf)
        .then(function(response) {
          return response.json().then(function(list) {
            if (list.length > 0) {
              socials.list = list[0][0];
              socials.active = list[1][0];
            }
          });
        })
        .catch(function(error) {
          console.error(error);
        });
       */
    }
  }
});


dateform = new Vue({
  el: '#formdatepick',
  data: function () {
    return {
    date: null,
    phone: null,
    curMask: 7
      }
  },
  components: {
    datepicker: vuejsDatepicker
  }
});

footerform = new Vue({
  el: '#footerform',
  data: function () {
    return {
      phone: null
    }
  }
});
/**
 * Очевидно, каталог
 * @type {Vue}
 */
catalog = new Vue({
  el: '#catalog',
  data: function () {
    return {
      products: [],
      cart: false,
      buyer: {
        name: '',
        phone: '+7 (###) ###-##-##',
        date: null
      }
    }
  },
  components: {
    datepicker: vuejsDatepicker
  },
  methods: {
    /**
     * Показать форму оформления заказа
     */
    buy: function(idProduct) {
      this.cart = idProduct;
      togglePopup('popup-form');
    },
    addRequest: function (form) {
      request = {};

      if (form.id == 'quizform') {
        request.type = 1;
        request.posInfo_size = form.size.value;
        request.posInfo_name = form.name.value;
        request.congrats = form.congrats.value;
        request.phone = dateform.phone.replace(/\D+/g, "");
        request.receiveDate = dateform.date.toISOString().slice(0, 10);
        request.posInfo_flowers = '';
        request.posInfo_colors = [];
        str = '[';

        word = '';
        form.flowers.forEach( function(item, index){
          if (item.checked == true) {
            request.posInfo_flowers += item.value;
            if (str != '[') str += ', ';
            word += '[';
            form['colors_' + index].forEach(function (item) {
              if (item.checked == true) {
                if (word != '[') word += ',';
                word += '1';
              } else {
                if (word != '[') word += ',';
                word += '0';
              }
            });
            word += ']';
            str += word;
            word = '';
          }
        });
        str += ']';
        console.log(JSON.parse(str));
        request.posInfo_colors = str;
        request.posInfo_boxColor = form.boxColor.value;
      }
      if (form.id == 'orderform') {
        request.type = 0;
        request.posInfo_products = '['+this.cart+']';
        request.posInfo_name = catalog.buyer.name;
        request.phone = catalog.buyer.phone.replace(/\D+/g, "");
        request.receiveDate = catalog.buyer.date.toISOString().slice(0, 10);
        request.posInfo_boxColor = 0;
      }
      request.userid = partnerInfo.id;
      request.posInfo_quantity = '[1]';
      request.city = citySelect.city;
      request.geo = localStorage.getItem('addrStr');
      console.log(request);

      var xhttp1 = new XMLHttpRequest();
      xhttp1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          catalog.setLastSale();
          if (form.id == 'orderform') {togglePopup('popup-form');}
          togglePopup('popup-message');
        }
      };
      xhttp1.open("POST", API_SERVER + '/api/requests', true);
      xhttp1.setRequestHeader('Content-type', 'application/json');
      xhttp1.send(JSON.stringify(request));

      var xhttp2 = new XMLHttpRequest();
      xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var list = JSON.parse(xhttp2.responseText);
          if (list.length > 0) {
            socials.list = list[0][0];
            socials.active = list[1][0];
          }
        }
      };
      xhttp2.open("POST", API_SERVER + '/api/user/notify', true);
      xhttp2.setRequestHeader('Content-type', 'application/json');
      xhttp2.send(JSON.stringify(request));
/*
      fetch(API_SERVER + '/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
      .then(function(response) {
        if (response.status == 200) {
          catalog.setLastSale();
          if (form.id == 'orderform') {togglePopup('popup-form');}
          togglePopup('popup-message');
        }
      })
      .catch(function (error) {
        console.log(error)
      });

      fetch(API_SERVER + '/api/user/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })
          .then(function(response) {
            console.log(response.data)
          })
          .catch(function (error) {
            console.log(error)
          })
*/
    },

    /**
     * Получение продуктов по id партнера
     * @param id - id партнера
     */
    getProductsById: function(id) {
      this.products.splice(0, this.products.length);
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var products = JSON.parse(xhttp.responseText);
            products.forEach(function (item) {
              catalog.products.push(item);
            })
        }
      };
      xhttp.open("GET", API_SERVER + '/api/store/site/' + id, true);
      xhttp.send();
      /*
      return fetch(API_SERVER + '/api/store/site/' + id, fetchGetConf)
        .then(function(response) {
          return response.json().then(function(products) {
            if (products.length > 0) {
              console.log('products' + id)
              return products;
            } else {
              return [];
            }
          }).catch(function() {
            // В случае ошибки возвращаем пустой массив
            return [];
          });
        })
        .catch(function(error) {
          console.error(error);
        });
       */
    },
    /**
     * Полкчение продуктов по городу
     * @param city - город
     */
    getProductsByCity: function(city) {
      this.products.splice(0, this.products.length);
      return fetch(API_SERVER + '/api/store/city/' + city, fetchGetConf)
        .then(function(response) {
          return response.json().then(function(products) {
            if (products.length > 0) {
              return products;
            } else {
              return [];
            }
          }).catch(function() {
            return [];
          });
        })
        .catch(function(error) {
          console.error(error);
        });
    },
    setLastSale: function() {
      // Получаем id последнего партнера в очереди
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var products = JSON.parse(xhttp.responseText);
          if (products.length > 0) {
            console.log('products' + id)
            return products;
          } else {
            return [];
          }
        }
      };
      xhttp.open("PUT", API_SERVER + '/api/user/lastsale/' + partnerInfo.id, true);
      xhttp.send();
      /*
      return fetch(API_SERVER + '/api/user/lastsale/' + partnerInfo.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }})
          .then(function(response) {
            return response.json().then(function(products) {
              if (products.length > 0) {
                return products;
              } else {
                return [];
              }
            }).catch(function() {
              return [];
            });
          })
          .catch(function(error) {
            console.error(error);
          });
       */
    }
  }
});
