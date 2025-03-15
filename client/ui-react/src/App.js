import './App.css';
import {useState,useEffect} from 'react';
import FormsList from './Components/FormsList';
import FormView from './Components/FormView'
const tg = window.Telegram.WebApp;
function App() {
  // const myData = [
  //   {id: 1, title:'Обратная связь по 24.02.2024',status:'active'},
  //   {id: 2, title:'Студсовет на минималках',status:'solved'},
  //   {id: 3, title:'Волонтерство',status:'in progress'},
  //   {id: 4, title:'оргия в общаге на шаболовской',status:'in progress'},
  //   {id: 5, title:'Выборы главного петуха блока',status:'active'},
  // ];

  useEffect(() => {
    tg.ready();
    const loadData = async () => {
      try {
        // Загружаем список форм из forms.json
        const formsResponse = await fetch('/forms.json');
        const formsData = await formsResponse.json();
        setForms(formsData);

        // Загружаем поля форм из formFields.json
        const formFieldsResponse = await fetch('/formFields.json');
        const formFieldsData = await formFieldsResponse.json();
        setFormFields(formFieldsData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Обработка ошибок загрузки (например, отображение сообщения об ошибке)
      }
    };

    // Вызываем функцию загрузки данных
    loadData();
  }, []);
  const onClose = () => {
    tg.close()
  };
  const handleBackClick = () => {
    setSelectedForm(null);
  };


  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);


  const handleFormClick = (formId) => {
    const form = forms.find((item) => item.id === formId);
    setSelectedForm(form);
  };

  // Объявляем состояние для хранения полей формы
  const [formFields, setFormFields] = useState({});
  return (
    <div className="App">
      <button onClick={onClose}>Закрыть</button>
      <div className='MainTitle-container'>
        <h1 className='MainTitle'>СтудФормы</h1>
      </div>
      {selectedForm ? (
        <FormView form={selectedForm} onBackClick={handleBackClick} fields={formFields[selectedForm.id]}/>
      ) : (
        <FormsList items={forms} onFormClick={handleFormClick} />
      )}
    </div>
  );
}

export default App;
