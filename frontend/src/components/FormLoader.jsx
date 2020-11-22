import React from 'react';
import './loading.css';

const FormLoader = () => {
    return (
        <div id="form-loader">
            <img src={ require('../img/form-loader.gif')} alt="form-loader"/>
        </div>
    )
}

export default FormLoader
