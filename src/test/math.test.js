const {celsiusToFahrenheit,fahrenheitToCelsius} = require('../math')


test("Should convert 32 F to 0 C", () =>expect(fahrenheitToCelsius(32)).toBe(0));

test("Should convert 0 C to 32 F", () =>expect(celsiusToFahrenheit(0)).toBe(32));