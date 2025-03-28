import React from 'react';
import './FormView.css';
import { useState, useEffect } from 'react';

function FormView({ form, fields, onBackClick, updateFormStatus, setSelectedForm, initialStatus, userId }) {

    const [fieldValues, setFieldValues] = useState({});
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [status, setStatus] = useState(initialStatus);
    const [isSubmitted, setIsSubmitted] = useState(false); //  Новое состояние

    useEffect(() => {
      //  Инициализация fieldValues при монтировании компонента, если форма уже имеет данные
      if (form.status === 'solved') {
          setIsSubmitted(true);
      }
  }, [form.status]);
    useEffect(() => {
        //  Обновляем статус только если форма не отправлена и есть изменения
        if (!isSubmitted && isFormChanged) {
            if (Object.keys(fieldValues).length > 0 && status !== 'solved') {
                updateFormStatus(form.id, 'in progress');
                setStatus('in progress');
            }
        }
    }, [fieldValues, form.id, updateFormStatus, isSubmitted, isFormChanged, status]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFieldValues({
            ...fieldValues,
            [name]: value,
        });
        setIsFormChanged(true); //  Помечаем, что форма изменена
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateFormStatus(form.id, 'solved');
        setStatus('solved');
        setIsSubmitted(true); //  Помечаем, что форма отправлена
        setIsFormChanged(false); //  Форма больше не считается измененной
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
            <button type="submit" onClick={handleSubmit} disabled={status === 'solved' || !isFormChanged}>Отправить</button>
        </div>
    );
}

export default FormView;