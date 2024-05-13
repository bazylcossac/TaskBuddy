import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js"
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
    signOut } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js'

import { clearInputs } from "./index.js"

    const loggedInView = document.getElementById('logged-in-view')
    const loggedOutView = document.getElementById('logged-out-view')

    const loginEmail = document.getElementById('login-input-email')
    const loginPassword = document.getElementById('login-input-password')

    let isPopUpOnScreen = false 


const firebaseConfig = {
        apiKey: "AIzaSyCzOp-vLE5xMR7IQ4StkmEy-Oa-SkP8oPE",
        authDomain: "taskbuddy-dac4b.firebaseapp.com",
        projectId: "taskbuddy-dac4b",
        storageBucket: "taskbuddy-dac4b.appspot.com",
        messagingSenderId: "177025632297",
        appId: "1:177025632297:web:01b3cb00cba10d2a4b3438",
        measurementId: "G-DRXQSW44VB"
      }

      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)
      auth.useDeviceLanguage()
      const GoogleProvider = new GoogleAuthProvider()
      const FacebookProvider = new FacebookAuthProvider()


function authCreateAccWithEmail(){

        const email = loginEmail.value
        const password = loginPassword.value
    
        createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showLoggedInView()
        clearInputs(loginPassword)
      })
      .catch((error) => {
        if(!email.value || !password.value){
          alert("Please, check mail and password fields!")
          console.log(error.message);
        }
      })
    }


function authLoginWithEmail(){
    
        const email = loginEmail.value
        const password = loginPassword.value
    
        signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showLoggedInView()
        clearInputs(loginPassword)
      })
      .catch((error) => {
        alert('Invalid email or password!')
        console.log(error.message)
      })
    }
    

function loginWithGogle(){
        signInWithPopup(auth, GoogleProvider)
        .then((result) => {
          const user = result.user
          showLoggedInView()
          clearInputs(loginPassword)
        }).catch((error) => {
          console.log(error.message)
        })
    }
    

function loginWithFacebook(){
        const auth = getAuth();
    signInWithPopup(auth, FacebookProvider)
      .then((result) => {
        const credential = FacebookAuthProvider.credentialFromResult(result);
      })
      .catch((error) => {
            console.log(error.message);
      })
    }

    

function logOutEvent(){
      const popupDiv = document.createElement('div')
      popupDiv.setAttribute('id', 'logout-popup')
  
      const popupParagraf = document.createElement('p')
      popupParagraf.textContent = 'Do you want to log out?'
  
      popupDiv.appendChild(popupParagraf)
  
      const popupBtnsContainer = document.createElement('div')
      popupBtnsContainer.setAttribute('id','popup-auth-btns')
  
      const logoutBtn = document.createElement('button')
      const stayinBtn = document.createElement('button')
  
      popupBtnsContainer.appendChild(stayinBtn)
      popupBtnsContainer.appendChild(logoutBtn)
  
      popupDiv.appendChild(popupBtnsContainer)
  
  
      logoutBtn.textContent = 'Log out'
      stayinBtn.textContent = 'Stay in'
  
      logoutBtn.addEventListener('click', () => {
        
          signOut(auth)
          .then(() => {
              showLoggedOutView()
              document.body.removeChild(popupDiv)
              isPopUpOnScreen = false
          }).catch((error) => {
              console.error(error.message)
              
          })
      })
  
      stayinBtn.addEventListener('click',() => {
          document.body.removeChild(popupDiv)
          isPopUpOnScreen = false
      })

          if(!isPopUpOnScreen){
            document.body.appendChild(popupDiv)
          isPopUpOnScreen = true
          }            
  }

function showLoggedInView(){
        
        loggedOutView.style.display = 'none'
        loggedInView.style.display = 'flex'
    }

    

function showLoggedOutView(){
        loggedInView.style.display = 'none'
        loggedOutView.style.display = 'flex'
    }

export {authCreateAccWithEmail, authLoginWithEmail, loginWithGogle, loginWithFacebook, showLoggedInView, showLoggedOutView, logOutEvent}