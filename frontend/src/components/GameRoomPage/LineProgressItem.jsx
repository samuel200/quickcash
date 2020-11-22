import React from 'react';
import { Line } from 'rc-progress';

function LineProgressItem({ percentage }) {
    return (
        <Line percent={ percentage } strokeWidth="2" strokeColor="#249921" trailWidth="2" prefixCls="Progress:" />
    )
}

export default LineProgressItem
