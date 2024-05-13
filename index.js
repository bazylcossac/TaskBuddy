import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js"
import {getFirestore, collection, addDoc, serverTimestamp, onSnapshot,query,doc,orderBy,limit,where,getDocs,deleteDoc,updateDoc} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js"
import { getAuth,
         onAuthStateChanged,
        } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js'

import {authCreateAccWithEmail, authLoginWithEmail, loginWithGogle, loginWithFacebook, showLoggedInView, showLoggedOutView, logOutEvent} from './authFunc.js'




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
  const db = getFirestore(app)

  const collectionName = 'tasks'
  const taskRef = collection(db,collectionName)

  let importanceState = 0

 
/// DOM VARIABLES


const logInUserBtn = document.getElementById('sign-in-btn')
const createUserBtn = document.getElementById('create-acc-btn')

const loginWithGoogleBtn = document.getElementById('login-with-google')
const loginWithFacebookBtn = document.getElementById('login-with-facebook')

const userProfilePictureEl = document.getElementById('user-profilePic')

const addTaskBtn = document.getElementById('add-task-btn')
const appWorkStationEl = document.getElementById('app-work-section')

const importanceBtnsEl = document.getElementsByClassName('importance-btn')

const newestTaskSection = document.getElementById('new-tasks')

const sideTasks = document.getElementsByClassName('new-task-sideBar')


/// EVENT LISTENERS

createUserBtn.addEventListener('click', authCreateAccWithEmail)
logInUserBtn.addEventListener('click', authLoginWithEmail)

loginWithGoogleBtn.addEventListener('click', loginWithGogle)
loginWithFacebookBtn.addEventListener('click', loginWithFacebook)

userProfilePictureEl.addEventListener('click', logOutEvent)

addTaskBtn.addEventListener('click',setMainPageforNewTask)


onAuthStateChanged(auth, (user) => {
    if(user){
        showLoggedInView()
        handleUserProfilePicture(userProfilePictureEl, user)
        resetHTML(appWorkStationEl)
        fetchDataInRealtime()
        getFirstTaskFromDB()    
    }
    else{
        showLoggedOutView()
    }
})

async function fetchDataInRealtime(){
    const currentuser = auth.currentUser
    const q = query(taskRef, orderBy('timestamp', 'desc'),where('user', '==', currentuser.uid),limit(6))
    resetHTML(newestTaskSection)
    const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            newestTaskSection.appendChild(renderFiveNewestTasksSideBar(doc.data()))
    });

}


function renderFiveNewestTasksSideBar(taskData){

    const taskTitle = taskData.title
    const taskId = taskData.taskId
    const newTaskDiv = document.createElement('div')
    newTaskDiv.classList.add("new-task-sideBar")
    newTaskDiv.id = taskId
    
    const taskTitleH = document.createElement('p')
    taskTitleH.textContent = taskTitle.split(' ').join(' ').toUpperCase()
    newTaskDiv.appendChild(taskTitleH)


    newTaskDiv.addEventListener('click',(e) => {
        getTaskById(taskId)
        newTasksSideBarSelection(taskId)
        
        
    })

    return newTaskDiv
}

function newTasksSideBarSelection(taskId){
    for(let sideTask of sideTasks){
      
        if(taskId === Number(sideTask.id)){
            sideTask.classList.add('new-task-sideBar-selected')
            
        }
        else{
            sideTask.classList.remove('new-task-sideBar-selected')
            
        }
    
    }
}

async function getTaskById(taskId){
    const q = query(taskRef,where('taskId', '==', taskId))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        resetHTML(appWorkStationEl)
       appWorkStationEl.appendChild(renderTaskInMainPage(doc))
      
})
}


function renderTaskInMainPage(wholeDoc){
    let taskData = wholeDoc.data()
    const postId = wholeDoc.id
    let taskIsDone = taskData.isDone

    const title = taskData.title
    const body = taskData.body
    const taskDate = displayTaskDate(taskData.timestamp)

    let importanceNumber = taskData.importance

    let importance = ''

    if(importanceNumber === 1){
        importance = 'LOW'
    }
    else if(importanceNumber === 2){
        importance = 'MEDIUM'
    }
    else if(importanceNumber === 3){
        importance = 'IMPORTANT'
    }
    else if(importanceNumber === 4){
        importance = 'DONE'
    }
    else{
        importance = 'ADD IMPORTANCE'
    }

    const taskDiv = document.createElement('div')
    taskDiv.id = 'main-task-container'

    const importanceDiv = document.createElement('button')
    importanceDiv.id = `impor-${importanceNumber}`
    importanceDiv.classList.add('importance-main-page-btns')
    importanceDiv.textContent = importance
    taskDiv.appendChild(importanceDiv)

    const titleDateDiv = document.createElement('div')
    titleDateDiv.id = 'title-date-task-container'


    const titleH1 = document.createElement('h1')
    titleH1.id = 'main-page-task-title'
    titleH1.classList.add('cool-link')
    titleH1.textContent = title


    const datePara = document.createElement('p')
    datePara.id = 'task-date-paragraph'
    datePara.classList.add('cool-link')
    datePara.textContent = taskDate

    titleDateDiv.appendChild(titleH1)
    titleDateDiv.appendChild(datePara)
    taskDiv.appendChild(titleDateDiv)


    const taskBody = document.createElement('div')
    const taskBodyP = document.createElement('p')
    taskBody.id = 'main-page-task-body'

    taskBodyP.innerHTML = replaceNewLineWithBr(body)
    taskBody.appendChild(taskBodyP)
    taskDiv.appendChild(taskBody)

    const taskBtnsContainer = document.createElement('div')
    taskBtnsContainer.id = 'main-page-btns-container'

    const doneBTN = document.createElement('button')
    doneBTN.textContent =  taskIsDone ? 'UNDONE' : 'DONE'
    doneBTN.id = 'impor-1'
    doneBTN.classList.add('main-page-task-btns')

    const editBTN = document.createElement('button')
    editBTN.textContent = 'EDIT'
    editBTN.id = 'impor-2'
    editBTN.classList.add('main-page-task-btns')

    const deleteBTN = document.createElement('button')
    deleteBTN.textContent = 'DELETE'
    deleteBTN.id = 'impor-3'
    deleteBTN.classList.add('main-page-task-btns')

    taskBtnsContainer.appendChild(doneBTN)
    taskBtnsContainer.appendChild(editBTN)
    taskBtnsContainer.appendChild(deleteBTN)

    taskDiv.appendChild(taskBtnsContainer)

    doneBTN.addEventListener('click',() => {
        taskIsDone = !taskIsDone
        taskIsDone ? (doneBTN.textContent = 'UNDONE', importanceNumber = 4) : (doneBTN.textContent = 'DONE',importanceNumber = 5)
        updateDocToDB(body,title,importanceNumber,postId,taskIsDone)
        fetchDataInRealtime()
        getFirstTaskFromDB()
        renderFiveNewestTasksSideBar(taskData)

       
    })


    deleteBTN.addEventListener('click',() => {
        deleteDocFromDB(wholeDoc)
        fetchDataInRealtime()
        getFirstTaskFromDB()
        renderFiveNewestTasksSideBar(taskData)
    })

    editBTN.addEventListener('click',() => {
        setMainPageforNewTask(title,body,postId,taskData,taskIsDone)
        
    })

    

    return taskDiv
}



async function getFirstTaskFromDB(){
    const currentuser = auth.currentUser
    const q = query(taskRef, orderBy('timestamp', 'desc'),where('user', '==', currentuser.uid),limit(1))
    resetHTML(newestTaskSection)
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        resetHTML(appWorkStationEl)
        appWorkStationEl.appendChild(renderTaskInMainPage(doc)) 
    });
}

async function deleteDocFromDB(wholeDoc){

    const taskId = wholeDoc.id

    await deleteDoc(doc(db, collectionName, taskId));

}

async function updateDocToDB(body,title,importance,postId,isDone){

    const postRef = doc(db, collectionName, postId);

    await updateDoc(postRef, {
        body:body,
        title:title,
        importance:importance,
        timestamp: serverTimestamp(),
        isDone:isDone
      });

      
}


function replaceNewLineWithBr(input){
    return input.replace(/\n/g, '<br>')
    
}


function displayTaskDate(firebaseDate){

    if(firebaseDate === null){
        return `Date not avaliable`
    }

    const createdTimeTask = firebaseDate.toDate()

    let hour = createdTimeTask.getHours()
    let minutes = createdTimeTask.getMinutes()
    
    const year = createdTimeTask.getFullYear()

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    const month = months[createdTimeTask.getMonth()]
    
    const day = createdTimeTask.getDate()
    
    if(minutes <= 9){
        minutes = `0${minutes}`
    }
    if(hour <= 9){
        hour = `0${hour}`
    }

    return `${hour}:${minutes} | ${day} ${month} ${year}`
}

function showMainPageWithTasks(){
    appWorkStationEl.innerHTML = '<div id="no-tasks-yet">No tasks found...</div>'
    
}

function setMainPageforNewTask(taskTitle = '', taskBody = '', postId = 0,taskData, taskIsDone){

        const newTaskDiv = document.createElement('div')
        newTaskDiv.id = "task-create-container"

        const createTaskH1 = document.createElement('h1')
        createTaskH1.textContent = "Create new  task:"
        newTaskDiv.appendChild(createTaskH1)

        const taskInputsDiv = document.createElement('div')
        taskInputsDiv.id = "task-inputs-section"

        taskInputsDiv.innerHTML = `  <div>
        <p class="cool-link">Task title:</p><input type="text" id="task-title" maxlength="27" />
    </div>
    <div>
        <p class="cool-link">Task body:</p><textarea id="task-body"></textarea>
    </div>
    <p class="cool-link">Select importance: </p>
    <div id="importance-select">
        <div><button id="impor-1" class="importance-btn">LOW</button></div>
        <div><button id="impor-2" class="importance-btn" >MEDIUM</button></div>
        <div><button id="impor-3" class="importance-btn">IMPORTANT</button></div>
    </div>`


    const saveTaskBtn = document.createElement('button')
    saveTaskBtn.id = 'save-task-btn'
    saveTaskBtn.classList.add('task-create-btns')
    saveTaskBtn.textContent = 'ADD TASK'

    taskInputsDiv.appendChild(saveTaskBtn)
    newTaskDiv.appendChild(taskInputsDiv)

    appWorkStationEl.innerHTML = ''
    appWorkStationEl.appendChild(newTaskDiv) 

    for(let importanceBtn of importanceBtnsEl){
        importanceBtn.addEventListener('click', importanceBtnChooseLogic)
    }

    const title = document.getElementById('task-title')
    const body = document.getElementById('task-body')

if(taskBody && taskTitle && postId){
    document.getElementById('task-title').value = taskTitle
    document.getElementById('task-body').value = taskBody
    saveTaskBtn.textContent = 'SAVE TASK'
    saveTaskBtn.addEventListener('click',() => {
        if(title.value === '' || body.value === '' || importanceState === 0){
            alert('Task needs to contain title, body and importance state!')
            return 0
        }else{
            updateDocToDB(body.value,title.value,importanceState,postId,taskIsDone)
            resetHTML(appWorkStationEl)
            fetchDataInRealtime()
            getFirstTaskFromDB()
            renderFiveNewestTasksSideBar(taskData)  
        }
       
    })

}else{
    saveTaskBtn.addEventListener('click',()=>{
        if(title.value === '' || body.value === '' || importanceState === 0){
            alert('Task needs to contain title, body and importance state!')
            return 0
        }
        else{
            addNewTaskToDB(title.value,body.value,importanceState)
            clearInputs(title)
            clearInputs(body)
            clearImportanceButtonsAfterPost()
            fetchDataInRealtime()
        }
        })
}

}

async function addNewTaskToDB(title,body,importanceState){
    const randomTaskId = Math.floor(Math.random() * 1000000000000)
    const user = auth.currentUser
    try{
        const docRef = await addDoc(collection(db, collectionName), {
            title:title,
            body:replaceNewLineWithBr(body),
            user: user.uid,
            importance: importanceState,
            timestamp: serverTimestamp(),
            taskId: randomTaskId,
            isDone:false
          })
    
    } catch(erorr){
        alert(erorr.message)
    }
}


function importanceBtnChooseLogic(event){
    const selectedImportance = event.currentTarget.id

    changeStyleAfterSelection(selectedImportance)
    importanceState = returnImportanceState(selectedImportance) 
}

function changeStyleAfterSelection(selectedElement){
    for(let importance of importanceBtnsEl){
        if(selectedElement === importance.id){
            importance.parentNode.classList.add('btn-selected')
        }
        else{
            importance.parentNode.classList.remove('btn-selected')
        }
    }
}

function clearImportanceButtonsAfterPost(){
    for(let element of importanceBtnsEl){
        element.parentNode.classList.remove('btn-selected')
    }
}

function returnImportanceState(elementid){
    return Number(elementid.slice(6))
}


function handleUserProfilePicture(element, user){

    const photoUrl = user.photoURL

    if(photoUrl){
        element.src = photoUrl
    }
    else{
        element.src = "./assets/images/default-profile-picture.jpeg"
    }
}

function clearInputs(input){
    input.value = ''
}

function resetHTML(element){
    element.innerHTML = ''
}

export {clearInputs}
