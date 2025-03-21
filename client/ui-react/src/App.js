import './App.css';
import {useState,useEffect} from 'react';
import FormsList from './Components/FormsList';
import FormView from './Components/FormView';
import queryString from 'query-string';
const tg = window.Telegram.WebApp;
const backendUrl = process.env.REACT_APP_BACKEND_URL;
function App() {
  useEffect(() => {
    tg.ready();

    const parsedQuery = queryString.parse(window.location.search);
    const userIdFromUrl = parsedQuery.user_id;
    setUserId(userIdFromUrl); //  Устанавливаем ID пользователя

    const loadData = async () => {
      try {
        
        const formsResponse = await fetch('/forms.json');
        const formsData = await formsResponse.json();
        setForms(formsData);

        
        const formFieldsResponse = await fetch('/formFields.json');
        const formFieldsData = await formFieldsResponse.json();
        setFormFields(formFieldsData);


        if (userIdFromUrl) {
          const statusesResponse = await fetch(`${backendUrl}/api/user-statuses/${userIdFromUrl}`);
          const statusesData = await statusesResponse.json();
          setUserStatuses(statusesData);
          console.log('Статусы пользователя загружены:', statusesData);
      }


      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        
      }
    };

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
  const [userStatuses, setUserStatuses] = useState({}); //  Состояние для хранения статусов пользователя
  const [userId, setUserId] = useState(null); //  Состояние для хранения ID пользователя
  const [formFields, setFormFields] = useState({});



  const handleFormClick = (formId) => {
    const form = forms.find((item) => item.id === formId);
    setSelectedForm(form);
  };
  // для обновления статуса формы
  const updateFormStatus = async (formId, newStatus) => {
    try {
      await fetch(`/api/user-statuses/${userId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formId: formId, status: newStatus }),
      });

      //  Обновляем состояние на фронтенде
      setUserStatuses({
          ...userStatuses,
          [formId]: newStatus,
      });

      //  Обновляем статус в списке форм (необязательно, если хотите отображать актуальный статус в списке)
      const updatedForms = forms.map((form) => {
          if (form.id === formId) {
              return { ...form, status: newStatus };
          }
          return form;
      });
      setForms(updatedForms);
      console.log(`Статус формы ${formId} обновлен на ${newStatus}`);
  } catch (error) {
      console.error('Ошибка обновления статуса:', error);
  }
  };


  return (
    <div className="App">
      <button onClick={onClose}>Закрыть</button>
      <div className='MainTitle-container'>
        <h1 className='MainTitle'>СтудФормы</h1>
      </div>
      {selectedForm ? (
        <FormView 
        form={selectedForm} 
        onBackClick={handleBackClick} 
        fields={formFields[selectedForm.id]} 
        updateFormStatus={updateFormStatus} 
        setSelectedForm={setSelectedForm}
        initialStatus={userStatuses[selectedForm.id] || 'active'} //  Передаем начальный статус формы
        userId={userId} // Передаем ID пользователя
        />
      ) : (
        <FormsList items={forms.map(form => ({
          ...form,
          status: userStatuses[form.id] || 'active' //  Подставляем статус из userStatuses или 'active' по умолчанию
      }))} onFormClick={handleFormClick} />
      )}
    </div>
  );
}

export default App;
