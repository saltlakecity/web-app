import './App.css';
import {useEffect} from 'react';
import FormsList from './Components/FormsList';
const tg = window.Telegram.WebApp;
function App() {
  const myData = [
    {id: 1, title:'Обратная связь по 24.02.2024',status:'active'},
    {id: 2, title:'Студсовет на минималках',status:'solved'},
    {id: 3, title:'Волонтерство',status:'in process'},
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
      <FormsList items={myData}/>
    </div>
  );
}

export default App;
