import React from 'react'
import './FormsList.css'
import FormElement from './FormElement'
function FormsList({items}) {
  return (
    <div className='container'>
      {items.map((item) => (
        <FormElement
          key={item.id}
          id={item.id}
          title={item.title}
          status={item.status}
        />
      ))}
    </div>
  )
}

export default FormsList
