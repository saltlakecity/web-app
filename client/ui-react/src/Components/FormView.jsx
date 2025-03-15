import React from 'react'
import './FormView.css'
function FormView({form,onBackClick}) {
  return (
    <div>
      <h1>{form.title}</h1>
      {/* здесь будет отображение содержимого формы (заглушка) */}
      <p>Содержимое формы с ID: {form.id} пока не реализовано.</p>
      <button onClick={onBackClick}>Назад к списку</button>
    </div>
  )
}

export default FormView
