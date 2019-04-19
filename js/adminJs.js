"use strict";
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA0qrys7Q63Xgx8z59xj0GYaynbKB7Q2MY",
    authDomain: "quizapplication98.firebaseapp.com",
    databaseURL: "https://quizapplication98.firebaseio.com",
    projectId: "quizapplication98",
    storageBucket: "quizapplication98.appspot.com",
    messagingSenderId: "505662313420"
  };
  firebase.initializeApp(config);
  
  
  let count =0;
  let questionCollection = [];
  
  const getQuizDetail = async () => {
    const quizName = document.getElementById('quizName').value;
    const quizTitle = document.getElementById('quizTitle').value;
    const time = document.getElementById('time').value;
    const totalQuestions = document.getElementById('totalQuestions').value;
    const totalMarks = document.getElementById('totalMarks').value;
    const passMarks = document.getElementById('passMarks').value;
    const description = document.getElementById('description').value;
    if(quizName!=='' && quizTitle!=='' && time!=='' && totalMarks!=='' && totalQuestions!=='' && passMarks!=='' && description!=='' && questionCollection.length>0){
      const details = {
        quizName,
        quizTitle,
        time,
        totalQuestions,
        totalMarks,
        passMarks,
        description
      }
      
      var quiz = {
        details,
        questions : questionCollection
      }
      
      
      await firebase.database().ref('quiz').child(quizName).child(quizTitle).set(quiz)
      .then(() => {
        clearQuizDetails();
        document.getElementById('count').innerHTML= '';
        count = 0;
        swal({
          icon: 'success',
          text: 'Quiz successfully created!'
        })
      })
      .catch((error) => {
        swal({
          icon: 'warning',
          text: error.message
        })
      })
    }
    else if(questionCollection.length===0){
      swal({
        icon: 'warning',
        text: 'Please insert questions to create quiz!'
      })      
    }
    else{
      swal({
        icon: 'warning',
        text: 'Please fill all details about quiz!'
      })
    }
    
  }
  
  const clearQuizDetails = () => {
    document.getElementById('quizName').value='';
    document.getElementById('quizTitle').value='';
    document.getElementById('time').value='';
    document.getElementById('totalQuestions').value='';
    document.getElementById('totalMarks').value='';
    document.getElementById('passMarks').value='';
    document.getElementById('description').value='';
  }
  
  const clearQuestion =() => {
    document.getElementById('question').value ="";
    document.getElementById('answer').value='';
    document.getElementById('option1').value='';
    document.getElementById('option2').value='';
    document.getElementById('option3').value='';
  }
  
  const getQuizQuestion = () => {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;
    const countElement = document.getElementById('count');
    if(question!=='' && answer!=='' && option1!=='' && option2!=='' && option3!==''){

      count++;
      countElement.innerHTML = `${count} questions added`
      const questionsObj = {
        question,
        option1,
        option2,
        option3,
        answer
      }
      
      questionCollection.push(questionsObj);    
      clearQuestion();
    }
    else{
      swal({
        icon: 'warning',
        text: 'Please fill out the question and its options!'
      })
    }
  }
  
  
  const quiz = document.getElementById('quizShow');
  const makeOnline = document.getElementById('makeOnline');
  firebase.database().ref('quiz')
  .on('child_added', data => {
    onlineQuiz(data.key)  
    quiz.innerHTML += `<div class="card">${data.key}</div>`
  })
  
  const onlineQuiz = async (key) => {
    await firebase.database().ref('quiz').child(key)
    .once('value', item => {
      let userdata = item.val();
      for(let keys in userdata){
        makeOnline.innerHTML += `<div class="card">
          <span class="spanText">${keys}</span>
          <button onclick='genKey(this,"${key}","${keys}")' class="btn btn-primary" style="float:right">Generate Key</button>
        </div>`
      }
    })
  }
  
  const genKey = (btn,quizName,quizTitle) => {
    swal({
      text: 'Generate Key For This Quiz.',
      content: "input",
    })
    .then( async (value)=>{
      if(value !== ''){
        await firebase.database().ref('quiz').child(quizName).child(quizTitle).child('details')
        .once('value',async data => {
          let userdata = data.val();
          userdata.key = value;
          await firebase.database().ref('quiz').child(quizName).child(quizTitle).child('details').set(userdata)
          .then(()=>{
            swal({
              icon: 'success',
              text: "Key generated!"
            })
          })
          .catch((error)=>{
            swal({
              icon: 'warning',
              text: error.message
            })
          })
        })
        .catch((error)=>{
          swal({
            icon: 'warning',
            text: error.message
          })
        })
      }
      else{
        swal({
          icon: 'warning',
          text: 'Please enter a valid key!'
        })
      }
    })
  }