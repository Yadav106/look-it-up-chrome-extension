import React from 'react'
import { nanoid } from 'nanoid'
import './saved.css'

const Saved = (props) => {
  return (
    <div className='saved'>
        <h1 className="saved--words--title" data-theme={props.isDark?"dark":""}>Saved Words</h1>
        <ul className="saved--words">
            {
            props.savedWords.map(word => {
                return <li 
                    className="saved--word" 
                    data-theme={props.isDark?"dark":""} 
                    key={nanoid()}
                    onClick={() => {
                    props.setPrompt(word);
                    props.setSearch(true);
                    }}
                >
                    {word}
                </li>
            })
            }
        </ul>
    </div>
  )
}

export default Saved