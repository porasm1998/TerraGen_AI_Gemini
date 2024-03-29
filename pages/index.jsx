import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';

import styles from "./index.module.css";


export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState();
  const [count, setCounter] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [editableResult, setEditableResult] = useState("");
  const inputRef = useRef(null);
  const spanRef = useRef(null);


  const toggleEdit = () => {
    if (!isEditable) {
      setEditableResult(result); // Copy the result into the editable result
    }
    setIsEditable(prevState => !prevState);
  };

  useEffect(() => {
    const savedOutput = localStorage.getItem('editedOutput');
    if (savedOutput) {
        setEditableResult(savedOutput);
    }
}, []);
  
  useEffect(() => {
    if (spanRef.current && inputRef.current) {
        const spanHeight = spanRef.current.offsetHeight;
        const inputHeight = inputRef.current.offsetHeight;

        if (spanHeight > inputHeight) {
            inputRef.current.style.height = `${spanHeight}px`;
        }
    }
}, [promptInput]);

const saveEdit = () => {
  setResult(editableResult);
  setIsEditable(false);
};

  async function onSubmit(e) {
    e.preventDefault();

    if (count === 10) {
      return alert('You have reached your limit.');
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput })
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.error?.message || `Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setCounter(count + 1);
      //setPromptInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TerraGen-AI</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>

      </Head>

      <img src='/favicon.ico' className={styles.logo} alt="TerraGen-AI logo" />
      <h2 className={styles.title}>TerraGen-AI</h2>
<h5 className={styles.sub}>Powered by <span className={styles.googleGemini}>Google Gemini</span></h5>


      <form onSubmit={onSubmit} className={styles.searchForm}>
      <div className={styles.inputWrapper}>
      <textarea
        ref={inputRef}
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          className={styles.searchInput}
          placeholder='Enter your terraform prompt'
          rows='3' // starts with a single row
        />
        </div>
        <button type="submit" className={styles.searchButton}>Generate</button>
    
      
      </form>

      {result && (
         <div className={styles.result}>
         {isEditable ? (
             <>
                 <textarea
                     value={editableResult}
                     onChange={(e) => setEditableResult(e.target.value)}
                     className={styles.textarea}
                 />
                 <button onClick={saveEdit} className={styles.saveButton}>Save</button>
             </>
         ) : (
             <pre>{result}</pre>
         )}
         <button onClick={toggleEdit} className={styles.editButton}>Edit Output</button>
     </div>
      )}
    </div>
  );
}
