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

let data = localStorage.getItem('UserAuth');
data = JSON.parse(data);
let myUid = data.uid;

window.addEventListener('load', () => {
    // loadQuestions();
    // setTimeout(() => {
    //     const liCollection = userList.getElementsByTagName('li'); 
    //     if(liCollection.length===0){
    //         userList.style.padding = '1rem';
    //         userList.style.textAlign = 'center';
    //         userList.innerHTML = 'You Have Joined No Quiz Yet.'
    //     }
    // },3000)
})

let quizDetail;
let questionsObj = [];
const loadQuestions = async () => {
    await firebase.database().ref('quiz').child('Css').child('Css1')
    .once('value', data => {
        let userdata = data.val();
        quizDetail = userdata.details;
        for(let key in userdata.questions)
        {
            questionsObj.push(userdata.questions[key])
        }
        // console.log(questionsObj)
    })
    .then(() => {
        // startTimer();
        showQuestions();
    })
}
let answer;
let generatedNum = []
let generatedAnsNum = []
let questionCount = 1;
let correctCount = 0;
const showQuestions = () => {
    generatedAnsNum = [];
    let answers = [];
    if(questionCount<=quizDetail.totalQuestions){
        
        document.querySelector('#quesCount').innerHTML = `${questionCount} of ${quizDetail.totalQuestions}`
        const index = generateRandom(questionsObj.length);
        const question = document.getElementById('question');
        const option1Value = document.getElementById('option1Value');
        const option1Text = document.getElementById('option1Text');
        const option2Value = document.getElementById('option2Value');
        const option2Text = document.getElementById('option2Text');
        const option3Value = document.getElementById('option3Value');
        const option3Text = document.getElementById('option3Text');
        const option4Value = document.getElementById('option4Value');
        const option4Text = document.getElementById('option4Text');
        answer = questionsObj[index].answer;
        answers.push(questionsObj[index].option1)    
        answers.push(questionsObj[index].option2)    
        answers.push(questionsObj[index].option3)    
        answers.push(questionsObj[index].answer) 
        question.innerHTML = `Q) ${questionsObj[index].question}`;
        let ansIndex = generateRandomForAnswer();
        option1Value.value  = answers[ansIndex];
        option1Text.innerHTML = answers[ansIndex];
        ansIndex = generateRandomForAnswer();
        option2Value.value  = answers[ansIndex];
        option2Text.innerHTML = answers[ansIndex];
        ansIndex = generateRandomForAnswer();
        option3Value.value  = answers[ansIndex];
        option3Text.innerHTML = answers[ansIndex];
        ansIndex = generateRandomForAnswer();
        option4Value.value  = answers[ansIndex];
        option4Text.innerHTML = answers[ansIndex];
        questionCount++;
    }
    else{
        let result = (100/Number(quizDetail.totalQuestions))*correctCount;
        let isPassed = result>50 ? 'Passed' : 'Failed'
        swal({
            Title: 'Result!',
            text: `Obtained Marks: ${result}% \n Status: ${isPassed}`
        })
        .then(()=> {
            location='home.html'
        })
    }
}

const checkAnswer = () => {
    
    const userAns = document.querySelector('input[name="group3"]:checked').value;
    console.log(userAns)
    if(answer===userAns){
        correctCount++
        console.log(correctCount)
    }
    document.querySelector('input[name="group3"]:checked').checked = false;
}

const generateRandom = (range) => {
    let num = Math.floor((Math.random()*range));
    for(let i=0;i<=generatedNum.length;i++){
        if(generatedNum.indexOf(num) === -1){
            generatedNum.push(num);
            return num
        }
        else{
            num = Math.floor((Math.random()*range));
            i=0;
        }
    }
    
}

const generateRandomForAnswer = () => {
    let num = Math.floor((Math.random()*4));
    for(let i=0;i<=generatedAnsNum.length;i++){
        if(generatedAnsNum.indexOf(num) === -1){
            generatedAnsNum.push(num);
            return num
        }
        else{
            num = Math.floor((Math.random()*4));
            i=0;
        }
    }
}

const showQuiz = () => {
    const keyInput = document.getElementById('key').value;
    if(keyInput!==''){
        if(keyInput===keyToCheck){

            const keyContain = document.getElementById('key-contain');
            const quizContain = document.getElementById('quiz-contain');
            keyContain.classList.remove('contain-view');
        keyContain.classList.add('noheight');
        quizContain.classList.remove('noheight');
        quizContain.classList.add('contain-view');
        startTimer();
        }
        else{
            swal({
                icon: 'warning',
                text: 'Invalid Key'
            })            
        }
    }
    else{
        swal({
            icon: 'warning',
            text: 'Please Enter Key'
        })
    }
}
let keyToCheck;
const getKeyForAuth = async () => {
    let name = getParameterByName('quizName')
    let title = getParameterByName('quizTitle')

    await firebase.database().ref('quiz').child(name).child(title)
    .once('value', item=> {
        let userdata = item.val();
        keyToCheck = userdata.details.key;
    })
}

const userList = document.getElementById('joinedList');

firebase.database().ref('students').child(myUid).child('attempted_Quiz')
.on('child_added', item => {
    if(userList!==null){
        userList.innerHTML += `<a href="./quizdetail.html?quizName=${item.key}&from=joined"><li>
        <div class="collapsible-header">
        <div>${item.key}</div>
        <div class="right">Joined</div>
        </div>
        </li></a>`
        console.log(item.key)
    }
    // getUserQuiz(item.key)
})

const availableList = document.getElementById('availableList');

firebase.database().ref('quiz')
.on('child_added', item => {
    if(availableList!==null){   
        availableList.innerHTML += `<a href="./quizdetail.html?quizName=${item.key}&from=available"><li>
        <div class="collapsible-header">
        <div>${item.key}</div>
        <div class="right">Join</div>
        </div>
        </li></a>`
    }
})


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const QuizDetails = async () => {
    const quizTitles = document.getElementById('quizDetail');
    const quizName = getParameterByName('quizName')
    const from = getParameterByName('from')
    if(from==='available'){
        await firebase.database().ref('quiz').child(quizName)
        .once('value', item =>{
            let userdata = item.val()
            for(let key in userdata){
                quizTitles.innerHTML += `<li style='cursor:pointer' onclick='showDescription("${quizName}","${key}")'>${key}</li>

                `
            }
        })
    }
}

const showDescription = async (name,title) => {
    const descibeContain = document.querySelector('.describe');
    await firebase.database().ref('quiz').child(name).child(title)
    .once('value', item => {
        let userdata = item.val();
        descibeContain.innerHTML = `
            <h5>Quiz Details</h5>
            <div class='contain-margin col s12'>
                <div class='info-div'>
                    <span>Quiz Name: </span><span>${userdata.details.quizName}</span>
                </div>
                <div class='info-div'>
                    <span>Quiz Title: </span><span>${userdata.details.quizTitle}</span>
                </div>
                <div class='info-div'>
                    <span>Total Questions: </span><span>${userdata.details.totalQuestions}</span>
                </div>
                <div class='info-div'>
                    <span>Time Allowed: </span><span>${userdata.details.time} min</span>
                </div>
                <div class='info-div'>
                    <span>Passing marks: </span><span>${userdata.details.passMarks}%</span>
                </div>
                <div class='info-div'>
                    <span>Total Marks: </span><span>${userdata.details.totalMarks}</span>
                </div>
                <div class='info-div'>
                    <span>Quiz Description: </span><span>${userdata.details.description}</span>
                </div>
                <div class='info-div'>
                <a href="./quiz.html?quizName=${name}&quizTitle=${title}" class="waves-effect waves-light btn">Start Quiz</a>
                </div>
            </div>
        `
    })
}

function startTimer() {
    var duration = 60 * quizDetail.time,
    display = document.querySelector('#timer');
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        display.textContent = minutes + ":" + seconds;
        
        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}
