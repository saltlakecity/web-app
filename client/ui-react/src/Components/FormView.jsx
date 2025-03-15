import React from 'react'
import './FormView.css'
function FormView({form,fields,onBackClick}) {
  return (
    <div className='container'>
      <div>
        <button onClick={onBackClick} className='button'>Назад</button>
      </div>
      <h1>{form.title}</h1>
      {/* Отображение полей формы */}
      {fields && fields.length > 0 ? (
        fields.map((field) => (
          <div className='field-container'key={field.name}>
            <label className='label' htmlFor={field.name}>{field.label}:</label>
            {field.type === 'textarea' ? (
              <textarea className='textarea' id={field.name} name={field.name} />
            ) : field.type === 'select' ? (
              <select className='textarea' id={field.name} name={field.name}>
                {field.options.map((option) => (
                  <option className='textarea' key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input className='textarea' type={field.type} id={field.name} name={field.name} />
            )}
          </div>
        ))
      ) : (
        <p>Нет полей для отображения.</p>
      )}
    </div>
  )
}

export default FormView
