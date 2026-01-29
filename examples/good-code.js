/**
 * Example 1: Good Code
 * Well-structured code with proper practices
 */

/**
 * Calculates the sum of an array of numbers
 * @param {number[]} numbers - Array of numbers to sum
 * @returns {number} The sum of all numbers
 */
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error("Input must be an array");
  }

  return numbers.reduce((sum, num) => sum + num, 0);
}

/**
 * Finds the maximum value in an array
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The maximum value
 */
function findMaximum(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error("Input must be a non-empty array");
  }

  return Math.max(...numbers);
}

/**
 * Calculates the average of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The average value
 */
function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error("Input must be a non-empty array");
  }

  const sum = calculateSum(numbers);
  return sum / numbers.length;
}

export { calculateSum, findMaximum, calculateAverage };
