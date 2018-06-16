import * as React from 'react';
import { connect } from 'react-redux';
import { IMidpoint, IOrdersUpdate } from '../../../types';
import { splitDigits } from '../../../utils';
import './index.css';

const Midpoint = ({ spread, midpoint, midpointDelta }: IMidpoint) => {
  const { significant: spreadSignificant } = splitDigits(spread, 8);
  const { significant: midpointSignificant } = splitDigits(midpoint, 8);
  const { significant: midpointDeltaSignificant } = splitDigits(midpointDelta * 100, 3); // convert delta to percent
  console.log('midpointDelta', midpointDelta);
  const positiveDelta = midpointDelta > 0;
  return midpoint ? (
    <tr>
      <td colSpan={2} className="midpoint-data">
        <span className="midpoint">Midpoint: {midpointSignificant}</span>
        <span className={`midpoint-delta ${positiveDelta ? 'positive' : 'negative'}`}>{midpointDeltaSignificant}%</span>
        <span className="spread">Spread: {spreadSignificant}</span>
      </td>
    </tr>
  ) : null;
}

export default connect(({ midpoint }: IOrdersUpdate) => (midpoint))(Midpoint);
