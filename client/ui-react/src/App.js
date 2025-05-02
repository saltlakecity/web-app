import './App.css';
import {useState,useEffect} from 'react';
import FormsList from './Components/FormsList';
import FormView from './Components/FormView';
import queryString from 'query-string';
const tg = window.Telegram.WebApp;
function App() {
  useEffect(() => {
          // инициализация webapp в тгшечке
    if (window.Telegram && window.Telegram.WebApp) {
        tg.ready();
        const parsedQuery = queryString.parse(window.location.search);
        const userIdFromUrl = parsedQuery.user_id;
        setUserId(userIdFromUrl);
        const loadData = async () => {
            try {
                const formsResponse = await fetch('/forms.json');
                if (!formsResponse.ok) {
                    throw new Error(`Ошибка загрузки forms.json: ${formsResponse.status}`);
                }
                const formsData = await formsResponse.json();
                setForms(formsData);
                const formFieldsResponse = await fetch('/formFields.json');
                if (!formFieldsResponse.ok) {
                    throw new Error(`Ошибка загрузки formFields.json: ${formFieldsResponse.status}`);
                }
                const formFieldsData = await formFieldsResponse.json();
                setFormFields(formFieldsData);
                if (userIdFromUrl) {
                    const backendUrl = process.env.REACT_APP_BACKEND_URL; // получение url и проверка на доступность
                    if (!backendUrl) {
                        throw new Error('REACT_APP_BACKEND_URL не определен!');
                    }
                    const statusesResponse = await fetch(`${backendUrl}/api/user-statuses/${userIdFromUrl}`);
                    if (!statusesResponse.ok) {
                        throw new Error(`Ошибка загрузки статусов: ${statusesResponse.status}`);
                    }
                    const statusesData = await statusesResponse.json();
                    setUserStatuses(statusesData);
                    console.log('Статусы пользователя загружены:', statusesData);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };
  
              loadData();
          } else {
              console.error('Telegram WebApp не инициализирован!');
          }
      }, []);

      const onClose = () => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
        } else {
            console.warn('Telegram WebApp не инициализирован, закрытие невозможно.');
        }
    };
  const handleBackClick = () => {
    setSelectedForm(null);
  };


  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});
  const [userId, setUserId] = useState(null);
  const [formFields, setFormFields] = useState({});



  const handleFormClick = (formId) => {
    const form = forms.find((item) => item.id === formId);
    setSelectedForm(form);
  };
  // для обновления статуса формы
  const updateFormStatus = async (formId, newStatus) => {
    try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        if (!backendUrl) {
            throw new Error('REACT_APP_BACKEND_URL не определен!');
        }
        const response = await fetch(`${backendUrl}/api/user-statuses/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formId: formId, status: newStatus }),
        });
        if (!response.ok) {
            throw new Error(`Ошибка обновления статуса: ${response.status}`);
        }

        setUserStatuses({
            ...userStatuses,
            [formId]: newStatus,
        });

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
      <button onClick={onClose} className='exitButton'>Закрыть</button>
      <div className='MainTitle-container'>
        {/* <h1 className='MainTitle'>СтудФормы</h1> */}
        <img src="/Top.png" alt='/Top.png'/>
      </div>
      {selectedForm ? (
        <FormView 
        form={selectedForm} 
        onBackClick={handleBackClick} 
        fields={formFields[selectedForm.id]} 
        updateFormStatus={updateFormStatus} 
        setSelectedForm={setSelectedForm}
        initialStatus={userStatuses[selectedForm.id] || 'active'}
        userId={userId}
        />
      ) : (
        <FormsList items={forms.map(form => ({
          ...form,
          status: userStatuses[form.id] || 'active'
      }))} onFormClick={handleFormClick} />
      )}
    </div>
  );
}

export default App;
