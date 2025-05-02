
import React from 'react';
import './FormView.css';
import { useState, useEffect } from 'react';

function FormView({ form, fields, onBackClick, updateFormStatus, setSelectedForm, initialStatus, userId,onClose }) {

    const [fieldValues, setFieldValues] = useState({});
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [status, setStatus] = useState(initialStatus);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Состояние для индикатора загрузки

    useEffect(() => {
        const loadSavedResponses = async () => {
            try {
                const backendUrl = process.env.REACT_APP_BACKEND_URL;
                if (!backendUrl) {
                    throw new Error('REACT_APP_BACKEND_URL не определен!');
                }
                const response = await fetch(`${backendUrl}/api/form-responses/${userId}/${form.id}`);
                if (response.ok) {
                    const savedResponses = await response.json();
                    setFieldValues(savedResponses);
                } else {
                    console.error('Ошибка загрузки сохраненных ответов:', response.status);
                }
            } catch (error) {
                console.error('Ошибка загрузки сохраненных ответов:', error);
            }
        };

        loadSavedResponses();
    }, [form.id, userId]);

    useEffect(() => {
        if (!isSubmitted && isFormChanged && status !== 'solved') {
            if (Object.keys(fieldValues).length > 0) {
                updateFormStatus(form.id, 'in progress');
                setStatus('in progress');
            }
        }
    }, [fieldValues, form.id, updateFormStatus, isSubmitted, isFormChanged, status]);

    useEffect(() => {
        const validateForm = () => {
            if (!fields) return false;

            for (const field of fields) {
                if (!fieldValues[field.name]) {
                    return false;
                }
            }
            return true;
        };

        setIsFormValid(validateForm());
    }, [fieldValues, fields]);

    const saveResponses = async () => {
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            if (!backendUrl) {
                throw new Error('REACT_APP_BACKEND_URL не определен!');
            }
            await fetch(`${backendUrl}/api/form-responses/${userId}/${form.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fieldValues),
            });
        } catch (error) {
            console.error('Ошибка сохранения ответов:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFieldValues({
            ...fieldValues,
            [name]: value,
        });
        setIsFormChanged(true);

        //  Сохраняем ответы в БД при каждом изменении
        saveResponses();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await updateFormStatus(form.id, 'solved');
            setStatus('solved');
            setIsSubmitted(true);
            setIsFormChanged(false);
            setSelectedForm(null);
        } catch (error) {
            console.error("Ошибка при отправке формы:", error);
            alert("Произошла ошибка при отправке формы. Попробуйте еще раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='formview-container'>
            <div>
                <div className='formview-header'>
                    <img src="/Top.png" alt="/Top.png" />
                </div>
                <div onClick={onClose} className='formview-exitButton'>
                    <img src='/christ.png' alt='/christ.png'/>
                </div>
                <div onClick={onBackClick} className='button'>
                    <img src='/arrowleft.png' alt='/arrowleft.png' className='form-view-arrow'/>
                </div>
            </div>
            <h1 className='form-title'>{form.title}</h1>
            {/* <p>Статус: {status}</p> */}
            {fields && fields.length > 0 ? (
                fields?.map((field) => (
                    <div className='field-container' key={field.name}>
                        <label className='label' htmlFor={field.name}>{field.label}:</label>
                        {field.type === 'textarea' ? (
                            <textarea
                                className='textarea'
                                id={field.name}
                                name={field.name}
                                value={fieldValues[field.name] || ''}
                                onChange={handleInputChange}
                                disabled={isSubmitted} //  блокировка если статус решен
                            />
                        ) : field.type === 'select' ? (
                            <select
                                className='textarea'
                                id={field.name}
                                name={field.name}
                                value={fieldValues[field.name] || ''}
                                onChange={handleInputChange}
                                disabled={isSubmitted} //  блокировка если статус решен
                            >
                                {field.options.map((option) => (
                                    <option className='textarea' key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                className='textarea'
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={fieldValues[field.name] || ''}
                                onChange={handleInputChange}
                                disabled={isSubmitted} //  блокировка если статус решен
                            />
                        )}
                    </div>
                ))
            ) : (
                <p>Нет полей для отображения.</p>
            )}
            <button
                className='submitButton'
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitted || !isFormValid || isSubmitting} //  кнопка отправить не работает если форма решена или форма не валидна
            >
                {isSubmitting ? "Отправка..." : "Отправить"}
            </button>
        </div>
    );
}

export default FormView;
