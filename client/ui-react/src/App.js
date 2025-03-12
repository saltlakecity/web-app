import './App.css';
import {useEffect} from 'react';
import FormsList from './Components/FormsList';
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
  return (
    <div className="App">
      <button onClick={onClose}>Закрыть</button>
      <div className='MainTitle-container'>
        <h1 className='MainTitle'>СтудФормы</h1>
      </div>
      <FormsList items={myData}/>
    </div>
  );
}

export default App;
