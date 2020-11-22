import React, { useEffect } from 'react'

function Collapsible({ faqs }) {
    useEffect(()=>{
        var elems = document.querySelectorAll('.collapsible');
        var instances = window.M.Collapsible.init(elems, {});
    }, [])
    return (
        <ul className="collapsible" style={{marginTop: "30px"}}>
            { faqs.map(({header, body})=><li>
                <div className="collapsible-header">{ header }</div>
                <div className="collapsible-body">{ body }</div>
            </li>)
            }
        </ul>
    )
}

export default Collapsible