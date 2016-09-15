(function () {
  'use strict'
  onload = function() {
    var $discount = document.getElementById('discount')
      , $bonus = document.getElementById('bonus')
      , user = getDiscountDecorator(new User());

    user = getBonusDecorator(user);
    $discount.innerHTML = user.getDiscount();
    $bonus.innerHTML = user.getBonus();
  }

  function User() {
    var now = new Date()
      , DAYS_IN_MONTH = 31
      , HOURS_IN_DAY = 24
      , newMonth = parseInt(Math.random() * now.getMonth(), 10)
      , newDate = 1 + parseInt(Math.random() * DAYS_IN_MONTH, 10)
      , newHours = parseInt(Math.random() * HOURS_IN_DAY, 10)

      , maxGlobalDiscount = 60
      , maxNightDiscount = 15
      , maxWeekendDiscount = 30
      , maxOrdersCount = 20
      , maxPrice = 200;

    this.lastVisitDate = new Date(now.getFullYear(), newMonth, newDate, newHours);
    this.globalDiscount = parseInt(Math.random() * maxGlobalDiscount, 10);
    this.nightDiscount = 1 + parseInt(Math.random() * maxNightDiscount, 10);
    this.weekendDiscount = 1 + parseInt(Math.random() * maxWeekendDiscount, 10);
    this.ordersCount = 1 + parseInt(Math.random() * maxOrdersCount, 10);
    this.ordersTotalPrice = this.ordersCount * (1 + parseInt(Math.random() * maxPrice, 10));
    this.bonus = 0;
    User.prototype = {
      constructor: User
    }
  }

  function getDiscountDecorator (user) {
    var extendedUser = cloneObj(user);

    extendedUser.getDiscount = function () {
      var discount = this.globalDiscount
        , WEEKEND_INDEXES = [0, 6]
        , NIGHT_HOURS = {FROM: 23, TO: 5}
        , now = new Date()
        , nowDay = now.getDay()
        , nowHours = now.getHours();

      if (WEEKEND_INDEXES.indexOf(nowDay) >= 0) {
        discount += this.weekendDiscount;
      }

      if (nowHours === NIGHT_HOURS.FROM || nowHours < NIGHT_HOURS.TO) {
        discount += this.weekendDiscount;
      }
        return discount;
      }
    return extendedUser;
  }

  function getBonusDecorator (user) {
    var extendedUser = cloneObj(user);

    extendedUser.getBonus = function () {
      var HOURS_IN_10_DAYS = 240
        , MILLISECONDS_IN_SECOND = 1000
        , MINUTES_IN_HOUR = 60
        , LIMIT = HOURS_IN_10_DAYS * MINUTES_IN_HOUR * MINUTES_IN_HOUR * MILLISECONDS_IN_SECOND
        , now = Date.now(new Date())

        , maxBonus = 200;

      this.bonus = this.bonus + this.ordersCount;

      if (now - Date.now(this.lastVisitDate) <= LIMIT) {
        this.bonus += parseInt(Math.random() * maxBonus, 10);
      }
      return this.bonus;
    }
    return extendedUser;
  }

  function cloneObj(obj) {
    var result = obj;

    if (Array.isArray(obj)) {
      result = [];
      obj.forEach(function (item) {
        result.push(cloneObj(item));
      });
    } else if (typeof obj === 'object') {
      var prototype = obj.prototype || null;
      result = Object.create(prototype);
      var keys = Object.getOwnPropertyNames(obj);
      keys.forEach(function (key) {
        var itemDescriptor = Object.getOwnPropertyDescriptor(obj, key)
          , clonedItem = cloneObj(obj[key]);

        if (itemDescriptor.hasOwnProperty('value')) {
          itemDescriptor.value = clonedItem;
        }

        Object.defineProperty(result, key, itemDescriptor);
      });
    }
    return result;
  }
})();