/**
 * Example 2: Code with Issues
 * Demonstrates various code smells and anti-patterns
 */

// Magic numbers without explanation
function calculatePrice(quantity) {
  return quantity * 99 + 15 + 7;
}

// Long function with too many responsibilities
function processUserData(data) {
  var temp = data;
  console.log("Processing user data...");
  
  if (temp) {
    if (temp.name) {
      if (temp.email) {
        if (temp.age) {
          if (temp.age > 18) {
            console.log("User is adult");
            // More nested logic...
            for (let i = 0; i < temp.items.length; i++) {
              for (let j = 0; j < temp.items[i].length; j++) {
                if (temp.items[i][j] > 100) {
                  console.log("Processing expensive item");
                  console.log("Processing expensive item");
                  console.log("Processing expensive item");
                }
              }
            }
          }
        }
      }
    }
  }
  
  return temp;
}

// Function with too many parameters
function createUser(firstName, lastName, email, phone, address, city, state, zip, country, age, gender) {
  console.log("Creating user...");
  return { firstName, lastName, email, phone, address, city, state, zip, country, age, gender };
}

// Dead code after return
function getData() {
  return "data";
  console.log("This will never execute");
  const x = 42;
}

// Duplicate code
function processA() {
  const result = data.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b, 0);
  return result;
}

function processB() {
  const result = data.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b, 0);
  return result;
}

// Nested ternary (hard to read)
const status = user.isActive ? user.isPremium ? "premium" : "regular" : "inactive";

// Poor variable naming
function doStuff(x, y) {
  const temp = x + y;
  const data = temp * 2;
  const val = data / 3;
  return val;
}
