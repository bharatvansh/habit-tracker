import '@testing-library/jest-dom';

// Mock SVGElement.prototype.getTotalLength for JSDOM
if (!SVGElement.prototype.getTotalLength) {
  SVGElement.prototype.getTotalLength = () => 0;
}
