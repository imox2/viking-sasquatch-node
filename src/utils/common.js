export function getRandomNumber(lowerBound, upperBound) {
    const random= Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
    console.log("random:",random);
    return random;
  }
