var fetchGetConf = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

var citySelect = new Vue({
  el: '#city-select',
  data: {
    cities: [],
    selectedIndex: false,
    showList: false
  },
  computed: {
    city: function() {
      if (this.cities.length < 1) return false;
      return this.cities[this.selectedIndex];
    }
  },
  created: function () {
    this.getCities();
  },
  methods: {
    getCities: function () {
      fetch('http://ibapi.fobesko.com/public/api/user/cities', fetchGetConf)
      .then(function(response) {
        response.json().then(function(cities) {
          if (cities.length > 0)
            citySelect.addCities(cities);
        });
      })
      .catch(function(error) {
        console.error(error);
      });
    },
    /**
     * @param cities - массив с городами [{city: cityName}, {city: cityName}]
     */
    addCities: function(cities) {
      cities.forEach(function(element) {
        citySelect.cities.push(element.city);
      });
      citySelect.selectedIndex = 0;
    },
    /**
     * @param index - индекс города в массиве this.cities
     */
    selectCity: function(index) {
      this.selectedIndex = index;
      this.showList = false;
    }
  }
});