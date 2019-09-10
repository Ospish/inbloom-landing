// Конфиги для  fetch
var fetchGetConf = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

//Проверяем есть ли каталог на странице
var hasCatalog = document.getElementById('catalog');


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
      if (this.cities.length < 1) return false;
      return this.cities[this.selectedIndex];
    }
  },
  watch: {
    /**
     * Отслеживаем изменение индекса города (меняется при смене города в шапке)
     * @param value
     */
    selectedIndex: function(index) {
      if (index === false) return;
      partnerInfo.getId(this.cities[index]);
      if (hasCatalog) {
        catalog.getProductsByCity(this.cities[index]).then(function(products) {
          catalog.addProducts(products);
        });
      }
    }
  },
  created: function () {
    // Получаем всем города и добавляем их в массив this.cities
    this.getCities().then(function(cities) {
      citySelect.addCities(cities);
    });
  },
  methods: {
    init: function() {

    },
    /**
     * Получение городов
     */
    getCities: function () {
      return fetch('http://ibapi.fobesko.com/public/api/user/cities', fetchGetConf)
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
    },
    /**
     * Добавление города
     * @param cities - массив с городами [{city: cityName}, {city: cityName}]
     */
    addCities: function(cities) {
      cities.forEach(function(element) {
        citySelect.cities.push(element.city);
      });
      citySelect.selectedIndex = 0;
    },
    /**
     * Смена города по индексу
     * @param index - индекс города в массиве this.cities
     */
    selectCity: function(index) {
      this.selectedIndex = index;
      this.showList = false;
    }
  }
});

/**
 * Информация о выбраном партнере
 * @type {Vue}
 */
partnerInfo = new Vue({
  el: '#header-contacts',
  data: {
    email: false,
    phone: false
  },
  methods: {
    /**
     * Получаем id партнера у которого дольше всего небыло заказа в этом городе
     * @param city - город партнера
     */
    getId: function(city) {
     return fetch('http://ibapi.fobesko.com/public/api/user/city?city=' + city, fetchGetConf)
      .then(function(response) {
        return response.json().then(function(id) {
          if (id.length > 0) {
            partnerInfo.getInfo(id[0]['id']);
            socials.getSocials(id[0]['id']);
          }
        });
      })
      .catch(function(error) {
        console.error(error);
      });
    },
    /**
     * Получение инофрмации о партнере по id
     * @param id - id партнера
     */
    getInfo: function(id) {
      return fetch('http://ibapi.fobesko.com/public/api/user/info/' + id, fetchGetConf)
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
     * Получение социальных ситей по id партнера
     * @param id - id партнера
     */
    getSocials: function(id) {
      return fetch('http://ibapi.fobesko.com/public/api/user/socials/' + id, fetchGetConf)
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
    }
  }
});


/**
 * Очевидно, каталог
 * @type {Vue}
 */
catalog = new Vue({
  el: '#catalog',
  data: {
    products: [],
    cart: false,
    buyer: {
      name: '',
      phone: '',
      date: false
    }
  },
  methods: {
    /**
     * Показать форму оформления заказа
     */
    buy: function(idProduct) {
      this.cart = idProduct;
      togglePopup('popup-form');
    },

    /**
     * Получение продуктов по id партнера
     * @param id - id партнера
     */
    getProductsById: function(id) {
      this.products.splice(0, this.products.length);
      return fetch('http://ibapi.fobesko.com/public/api/store/site/' + id, fetchGetConf)
        .then(function(response) {
          return response.json().then(function(products) {
            if (products.length > 0) {
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
    },
    /**
     * Полкчение продуктов по городу
     * @param city - город
     */
    getProductsByCity: function(city) {
      this.products.splice(0, this.products.length);
      return fetch('http://ibapi.fobesko.com/public/api/store/city/' + city, fetchGetConf)
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
    addProducts: function(products) {
      // Получаем продукты и добавляем их в  массив this.products
      products.forEach(function(item) {
        catalog.products.push(item);
      });
    }
  }
});
