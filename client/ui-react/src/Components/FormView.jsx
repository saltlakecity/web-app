import React from 'react';
import './FormView.css';
import { useState, useEffect } from 'react';

function FormView({ form, fields, onBackClick, updateFormStatus, setSelectedForm, initialStatus, userId }) {

  const [fieldValues, setFieldValues] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); //  Новое состояние для валидации формы

  useEffect(() => {
      setStatus(initialStatus);
    }, [initialStatus]);

  useEffect(() => {
    if (!isSubmitted && isFormChanged) {
        if (Object.keys(fieldValues).length > 0) {
          updateFormStatus(form.id, 'in progress');
          setStatus('in progress');
          }
        }
    }, [fieldValues, form.id, updateFormStatus, isSubmitted, isFormChanged]);

    useEffect(() => {
        //  Функция для проверки заполненности всех полей
      const validateForm = () => {
          if (!fields) return false; //  Если нет полей, форма невалидна

          for (const field of fields) {
              if (!fieldValues[field.name]) {
                  return false; //  Если хоть одно поле не заполнено, форма невалидна
              }
          }
          return true; //  Если все поля заполнены, форма валидна
      };

      setIsFormValid(validateForm()); //  Устанавливаем состояние валидности формы
    }, [fieldValues, fields]);

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFieldValues({
          ...fieldValues,
          [name]: value,
      });
      setIsFormChanged(true);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      updateFormStatus(form.id, 'solved');
      setStatus('solved');
      setIsSubmitted(true);
      setIsFormChanged(false);
      setSelectedForm(null);
    };

    return (
      <div className='container'>
          <div>
              <button onClick={onBackClick} className='button'>Назад</button>
          </div>
            <h1>{form.title}</h1>
            <p>Статус: {status}</p>
            {fields && fields.length > 0 ? (
                fields?.map((field) => (
                    <div className='field-container' key={field.name}>
                        <label className='label' htmlFor={field.name}>{field.label}:</label>
                        {field.type === 'textarea' ? (
                            <textarea className='textarea' id={field.name} name={field.name} value={fieldValues[field.name] || ''} onChange={handleInputChange} />
                        ) : field.type === 'select' ? (
                            <select className='textarea' id={field.name} name={field.name} value={fieldValues[field.name] || ''} onChange={handleInputChange}>
                                {field.options.map((option) => (
                                    <option className='textarea' key={option} value={option}>{option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <input className='textarea' type={field.type} id={field.name} name={field.name} value={fieldValues[field.name] || ''} onChange={handleInputChange} />
                        )}
                    </div>
                ))
            ) : (
                <p>Нет полей для отображения.</p>

            )}
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={status === 'solved' || !isFormValid} //  Кнопка отключена, если форма невалидна
            >
                Отправить
            </button>
        </div>
    );
}

export default FormView;