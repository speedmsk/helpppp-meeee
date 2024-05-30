// LogSign.jsx
import React, { useEffect } from 'react';
import './App.css';
import Signnup from './Signup';
import LogIn from './log';
import Images from './images';

function LogSign() { 
  useEffect(() => {
    // Sélection des éléments du DOM
    const signin = document.querySelector("#sign-in-btn");
    const signup = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    // Fonctions à appeler lors des événements de clic
    const addSignUpMode = () => {
      container.classList.add("sign-up-mode");
    };

    const removeSignUpMode = () => {
      container.classList.remove("sign-up-mode");
    };

    // Vérifie si tous les éléments sont présents
    if (signup && signin && container) {
      // Ajout des écouteurs d'événements
      signup.addEventListener('click', addSignUpMode);
      signin.addEventListener('click', removeSignUpMode);
    }

    // Fonction de nettoyage pour supprimer les écouteurs d'événements
    // quand le composant est démonté
    return () => {
      if (signup) signup.removeEventListener('click', addSignUpMode);
      if (signin) signin.removeEventListener('click', removeSignUpMode);
    };
  }, []);

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <LogIn />
          <Signnup />
        </div>
      </div>
      <div className='swapp'>
        <Images />
      </div>
    </div>
  );
}

export default LogSign;
