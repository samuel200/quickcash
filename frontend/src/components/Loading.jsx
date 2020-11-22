import React from 'react';
import './loading.css';

export const Loading = ({element}) => {
    return (
        <div id="loader-background">
            <div id="loader">
                {element ? element : "Quick Cash"}
            </div>
        </div>
    )
}
