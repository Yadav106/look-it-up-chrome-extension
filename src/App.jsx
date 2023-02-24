import React, { useEffect } from 'react';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import Search from './components/Search';
import Navbar from './components/Navbar';
import Details from './components/Details';
import Error from './components/Error';
import { IoAddCircleSharp } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import Saved from './components/Saved';

const App = () => {

  const [prompt, setPrompt] = useState("");
  const[d, setD] = useState(null);
  const [err, setErr] = useState(null)
  const [isDark, setIsDark] = useState(JSON.parse(localStorage.getItem('theme')) || false)
  const [listVisible, setListVisible] = useState(false);
  const [savedWords, setSavedWords] = useState(JSON.parse(localStorage.getItem('savedWords') || '[]'));
  const [savedTextVisible, setSavedTextVisible] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if(search) {
      getdef();
      setSearch(false);
    }
  }, [search])

  function toggleListView() {
    setListVisible(prev => !prev);
  }

  function saveWord() {
    if(savedWords.includes(d[0]['word'])) return;
    setSavedWords(prev => [...prev, d[0]['word']]);
    setSavedTextVisible(true);
    setTimeout(() => {
      setSavedTextVisible(false);
    }, 2000);
  }

  function deleteWord(word) {
    setSavedWords(prev => prev.filter(w => w != word));
  }

  useEffect(() => {
    console.log('listVisible: ', listVisible);
  }, [listVisible])

  useEffect(() => {
    console.log('savedWords: ', savedWords);
    localStorage.setItem('savedWords', JSON.stringify(savedWords));
  }, [savedWords])

  function toggleDark(){
    setIsDark(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme);
      return newTheme;
    })
  }


  function promptChangeHandler(e) {
    setPrompt(e.target.value);
  }

  async function getdef() {
    try{
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${prompt}`);
      var data = await response.json();
      if(response.status == 404) {
        setErr(data);
        setD([]);
        return;
      }
      setErr(null);
      setD(data);
      setPrompt("");
    }
    catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="main">
      <div className="themebg" data-theme={isDark?"dark":""}></div>
      <div className='dict'>
        
        <Navbar isDark = {isDark} toggleDark = {toggleDark} toggleListView = {toggleListView}/>
        <Search 
          prompt = {prompt}
          getdef = {getdef}
          promptChangeHandler = {promptChangeHandler}
          isDark = {isDark}
        />

        {
          err
          ?
          <Error isDark={isDark}/>
          :
          <>
            {
              listVisible && <Saved isDark={isDark} savedWords={savedWords} setPrompt={setPrompt} setSearch={setSearch}/>
            }
            <div className="word--details">
              <div className="word--details--inner">
                {d && d[0] && <h1 className="word" data-theme={isDark?"dark":""}>{d[0]['word']}</h1>}
                {d && d[0] && d[0]['phonetics'] && d[0]['phonetics'][0] && <p className="phonetic" data-theme={isDark?"dark":""}>{d[0]['phonetics'][0]['text']}</p>}
              </div>
              {d && (
                savedWords.includes(d[0]['word'])?
                <MdDelete className="word--delete--icon" data-theme={isDark?"dark":""} onClick={() => deleteWord(d[0]['word'])}/>:
                <IoAddCircleSharp className="word--add--icon" data-theme={isDark?"dark":""} onClick={() => saveWord()}/>
              )}
            </div>
            {d && d.map(item => {
              const meanings = item["meanings"]
              return meanings.map(element => {
                return <Details isDark={isDark} element={element} key={nanoid()} />
              })
            })}
          </>
        }
        <div className="saved--text" style={{visibility: savedTextVisible?"visible":"hidden"}}>Saved</div>
      </div>
    </div>
  )
}

export default App;