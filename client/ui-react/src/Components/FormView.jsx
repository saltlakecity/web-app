import React from 'react'
import './FormView.css'
function FormView({form,fields,onBackClick}) {
  return (
    <div>
      <h1>{form.title}</h1>
      {/* Отображение полей формы */}
      {fields && fields.length > 0 ? (
        fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}:</label>
            {field.type === 'textarea' ? (
              <textarea id={field.name} name={field.name} />
            ) : field.type === 'select' ? (
              <select id={field.name} name={field.name}>
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input type={field.type} id={field.name} name={field.name} />
            )}
          </div>
        ))
      ) : (
        <p>Нет полей для отображения.</p>
      )}
      <button onClick={onBackClick}>Назад к списку</button>
    </div>
  )
}

export default FormView
