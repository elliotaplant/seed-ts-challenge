import * as React from 'react';
import { connect } from 'react-redux';
import { IMidpoint, IOrdersUpdate } from '../../../types';
import { splitDigits } from '../../../utils';
import './index.css';

// Component to display the midpoint row in the table
const Midpoint = ({ spread, midpoint, midpointDelta }: IMidpoint) => {
  const { significant: spreadSignificant } = splitDigits(spread, 8);
  const { significant: midpointSignificant } = splitDigits(midpoint, 8);
  const { significant: midpointDeltaSignificant } = splitDigits(midpointDelta * 100, 4); // convert delta to percent
  let deltaClass = 'positive';
  let deltaSign = '+';
  if (midpointDelta < 0) {
    deltaSign = '';
    deltaClass = 'negative';
  }
  return midpoint ? (
    <tr>
      <td colSpan={2} className="midpoint-data">
        <span className="midpoint">Midpoint: {midpointSignificant}</span>
        <span className={`midpoint-delta ${deltaClass}`}>{deltaSign}{midpointDeltaSignificant}%</span>
        <span className="spread">Spread: {spreadSignificant}</span>
      </td>
    </tr>
  ) : null;
}

export default connect(({ midpoint }: IOrdersUpdate) => (midpoint))(Midpoint);
