
var fetchGetConf = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

var hasCatalog = document.getElementById('catalog');

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
    selectedIndex: function(value) {
      if (value === false) return;
      partnerInfo.getId(this.cities[value]);
      if (hasCatalog) {
        catalog.getProductsByCity(this.cities[value]).then(function(products) {
          catalog.addProducts(products);
        });
      }
    }
  },
  created: function () {
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



catalog = new Vue({
  el: '#catalog',
  data: {
    products: []
  },
  methods: {
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
      products.forEach(function(item) {
        catalog.products.push(item);
      });
    }
  }
});
