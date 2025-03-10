import React from 'react'
import "./FormElement.css"
function FormElement({id,title,status}) {
  return (
    <div>
      <p>{id}</p>
      <p>{title}</p>
      <p>{status}</p>
    </div>
  )
}

export default FormElement
