import React from 'react'
import { Navlink } from 'react-router-dom'

const FilterLink = ({ filter, children}) => (
    <Navlink
        to={filter === 'SHOW_ALL' ? '/' : `/${ filter }`}
        activeStyle={ {
            textDecoration:'none',
            color:'black'
        }}
    >
    {children}
    </Navlink>
)

export default FilterLink