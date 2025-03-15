import React from 'react'
import './FormView.css'
import { useState, useEffect } from 'react';
function FormView({form,fields,onBackClick,updateFormStatus,setSelectedForm}) {
  const [fieldValues, setFieldValues] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  useEffect(() => {
    const hasValues = Object.keys(fieldValues).length > 0;
    if (hasValues && form.status !== 'solved') {
        updateFormStatus(form.id, 'in progress');
    }
}, [fieldValues, form.status, form.id, updateFormStatus]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // состояние fieldValues
    setFieldValues({
        ...fieldValues,
        [name]: value,
    });
    setIsFormChanged(true);
    // обновление статуса на in progress, если форма не доделана
    if (form.status !== 'solved') {
        updateFormStatus(form.id, 'in progress');
    }
};
  const handleSubmit = (event) => {
    event.preventDefault();
    // обновление статуса на solved
    updateFormStatus(form.id, 'solved');
    console.log('Значения полей:', fieldValues);
    alert("Форма отправлена!")
    setIsFormChanged(false);
    setSelectedForm(null);
};
  return (
    <div className='container'>
      <div>
        <button onClick={onBackClick} className='button'>Назад</button>
      </div>
      <h1>{form.title}</h1>
      {fields && fields.length > 0 ? (
        fields.map((field) => (
          <div className='field-container'key={field.name}>
            <label className='label' htmlFor={field.name}>{field.label}:</label>
            {field.type === 'textarea' ? (
              <textarea className='textarea' id={field.name} name={field.name} value={fieldValues[field.name] || ''}
              onChange={handleInputChange}/>
            ) : field.type === 'select' ? (
              <select className='textarea' id={field.name} name={field.name} value={fieldValues[field.name] || ''}
              onChange={handleInputChange}>
                {field.options.map((option) => (
                  <option className='textarea' key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input className='textarea' type={field.type} id={field.name} name={field.name} value={fieldValues[field.name] || ''}
              onChange={handleInputChange}/>
            )}
          </div>
        ))
      ) : (
        <p>Нет полей для отображения.</p>
        
      )}
      <button type="submit" onClick={handleSubmit} disabled={form.status === 'solved' || !isFormChanged}>Отправить</button>
    </div>
  )
}

export default FormView
