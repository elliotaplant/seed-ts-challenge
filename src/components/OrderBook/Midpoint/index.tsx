import * as React from 'react';
import { connect } from 'react-redux';
import { IMidpoint, IOrdersUpdate } from '../../../types';
import './index.css';

const Midpoint = ({ spread, midpoint, midpointDelta }: IMidpoint) => {
  return midpoint ? (
    <tr>
      <td>
        <span className="spread">{spread}</span>
        <span className="midpoint">{midpoint}</span>
        <span className="midpointDelta">{midpointDelta}</span>
      </td>
    </tr>
  ) : null;
}

export default connect(({ midpoint }: IOrdersUpdate) => (midpoint))(Midpoint);
