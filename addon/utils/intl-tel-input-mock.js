let IntlTelInputMock = function() {}

let IntlTelInputUtilsMock = function(publishableKey) {
  this.publishableKey = publishableKey
}

IntlTelInputUtilsMock.prototype.elements = function() {}

export { IntlTelInputMock, IntlTelInputUtilsMock }
