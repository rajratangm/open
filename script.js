import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer =document.querySelector('#chat_container');

let loadInterval ;

function loader(element){
  element.textContent='Raj is thinking';
  loadInterval= setInterval(()=>{
    element.textContent+='.';
    if(element.textContent==='Raj is thinking....'){
      element.textContent='Raj is thinking';
    }
  },300)
}

function typeText(element, text){
  let index=0;
  let interval = setInterval(()=>{
    if(index <text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval);
    }
  },20)
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`
}


function chatStripe (isAi, value, uniqueId){
   return (
    // `
    // <div class="wrapper ${isAi && 'ai'} >
    // <div class="chat">
    // <div class="profile">
    // <img src="${isAi? bot:user}" alt="${isAi? 'bot':'user'}"/>
    // </div>
    // <div class="message" id=${uniqueId}>${value}></div>
    // </div>
    // </div>
    
    // `
    `
    <div class="wrapper ${isAi ? 'ai' : ''}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}"/>
        </div>
        <div class="message" id=${uniqueId}>${value}></div>
      </div>
    </div>
  `
   )
}
//=============================================================================================


const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  // user's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();
  // bot's chat stripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  try {
      const response = await fetch('http://localhost:5000', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              prompt: data.get('prompt'),
          }),
      });

      clearInterval(loadInterval);
      messageDiv.innerHTML = '';

      if (response.ok) {
          const responseData = await response.json();
          const parsedData = responseData.bot.trim();
          console.log('Bot Response:', parsedData);
          typeText(messageDiv, parsedData);
      } else {
          const errorText = await response.text();
          console.error('Server Error:', errorText);
          messageDiv.innerHTML = 'Something Went Wrong';
          alert(errorText);
      }
  } catch (error) {
      console.error('Fetch Error:', error);
      messageDiv.innerHTML = 'Something Went Wrong';
      alert('An error occurred while communicating with the server.');
  }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
      handleSubmit(e);
  }
});


//============================================================================================


// const handleSubmit =async(e)=>{
//   e.preventDefault();
//   const data = new FormData(form);
//   // user'schatstripe
//   chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
//   form.reset();
//   // bot's chatstripe
//   const uniqueId = generateUniqueId();
//   chatContainer.innerHTML += chatStripe(true," ", uniqueId);
//   chatContainer.scrollTop= chatContainer.scrollHeight;
//   const messageDiv =document.getElementById(uniqueId);
//   loader(messageDiv);
//   const response  = await fetch('http://localhost:5000',{
//     method:'POST',
//     headers:{
//       'Content-Type':'application/json'
//     },
//     body:JSON.stringify({
//       prompt: data.get('prompt')
//     })
//   })
//   clearInterval(loadInterval)
//   messageDiv.innerHTML='';
//   if(response.ok){
//     const data = await response.json();
//     const parsedData = data.bot.trim();
//     console.log(parsedData)
//     typeText(messageDiv, parsedData);
//   }
//   else{
//     const err = await response.text();
//     console.log(response)
//     messageDiv.innerHTML="Something Went Wrong";
//     alert(err)
//   }
// }
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=>{
  if(e.keyCode ===13){
    handleSubmit(e);
  }
})