import React from 'react'
import "./FormElement.css"
function FormElement({id,title,status}) {
  let className = 'form-element'
  let statusTitle
  switch (status) {
    case 'active':
      className += ' active';
      statusTitle = 'Активно';
      break;
    case 'solved':
      className += ' solved';
      statusTitle = 'Отправлено';
      break;
    case 'in progress':
      className += ' inprogress';
      statusTitle = 'В процессе';
      break;
    default:
      break;
  }
  return (
    <div className={className}>
      <p className='id'>{id}.</p>
      <p className='title'>{title}</p>
      <p className='status'>{statusTitle}</p>
    </div>
  )
}

export default FormElement
