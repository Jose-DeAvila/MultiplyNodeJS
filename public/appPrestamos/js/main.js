if(document.getElementById('btnUp')){
  document.getElementById('btnUp').addEventListener('click', () => {
  window.scrollTo(0, 0);
});

}

function closeSession(){
  localStorage.removeItem('userData');
  window.location.href = '/appPrestamos';
}

function getInformation(){
  const userData = JSON.parse(localStorage.getItem('userData'));
  document.getElementById('name').value = unescape(userData.name);
  document.getElementById('email').value = unescape(userData.email);
  document.getElementById('id-delete').value = unescape(userData._id);
  document.getElementById('id').value = unescape(userData._id);
}

function checkScroll(){
  const btnUpC = document.getElementById('btnUpContainer');
  if(window.scrollY > 0){
    btnUpC.classList.add('active');
    btnUpC.disabled = false;
  }
  else{
    btnUpC.classList.remove('active');
    btnUpC.disabled = true;
  }
}

function menuToggle(){
  document.getElementById('options').classList.toggle('active');
}

function registerToggle(){
  document.getElementById('loginModal').classList.remove('active');
  document.getElementById('registerModal').classList.toggle('active');
}
function loginToggle(){
  document.getElementById('registerModal').classList.remove('active');
  document.getElementById('loginModal').classList.toggle('active');
}

async function loginHandler(e){
  e.preventDefault();
  const email = document.getElementById('email-login');
  const password = document.getElementById('password-login');
  const data = await fetch('../api/users/login', {
    method: 'POST',
    body: JSON.stringify({email: email.value, password: password.value}),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const dataParsed = await data.json();
  console.log(dataParsed);
  if(dataParsed.code === 401){
    document.getElementById('error-login').innerText = dataParsed.msg;
    email.value = '';
    password.value = '';
  }
  else if(dataParsed.code === 202){
    localStorage.setItem('userData', JSON.stringify(dataParsed.data));
    window.location.href = '/appPrestamos/dashboard';
  }
}

async function registerHandler(e){
  e.preventDefault();
  const name = document.getElementById('name-register');
  const email = document.getElementById('email-register');
  const password = document.getElementById('password-register');

  const data = await fetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({name: name.value, email: email.value, password: password.value}),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const dataParsed = await data.json();
  if(dataParsed.code==200){
    localStorage.setItem('userData', JSON.stringify(dataParsed.data));
    window.location.href = '/appPrestamos/dashboard';
  }
}
