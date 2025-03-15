import './App.css';
import {useState,useEffect} from 'react';
import FormsList from './Components/FormsList';
import FormView from './Components/FormView'
const tg = window.Telegram.WebApp;
function App() {
  const myData = [
    {id: 1, title:'Обратная связь по 24.02.2024',status:'active'},
    {id: 2, title:'Студсовет на минималках',status:'solved'},
    {id: 3, title:'Волонтерство',status:'in progress'},
    {id: 4, title:'оргия в общаге на шаболовской',status:'in progress'},
    {id: 5, title:'Выборы главного петуха блока',status:'active'},
    
  ]
  useEffect(() => {
    tg.ready();
  }, []);
  const onClose = () => {
    tg.close()
  };

  const [selectedForm, setSelectedForm] = useState(null);
  const handleFormClick = (formId) => {
    const form = myData.find((item) => item.id === formId);
    setSelectedForm(form);
  };
  const handleBackClick = () => {
    setSelectedForm(null);
  };

  return (
    <div className="App">
      <button onClick={onClose}>Закрыть</button>
      <div className='MainTitle-container'>
        <h1 className='MainTitle'>СтудФормы</h1>
      </div>
      {selectedForm ? (
        <FormView form={selectedForm} onBackClick={handleBackClick} />
      ) : (
        <FormsList items={myData} onFormClick={handleFormClick} />
      )}
    </div>
  );
}

export default App;
