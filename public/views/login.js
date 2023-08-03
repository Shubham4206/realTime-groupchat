const forgotBtn = document.getElementById('fgt-btn');
const loginForm = document.getElementById('loginform');
const baseUrl = `http://localhost:4000`;

loginForm.onsubmit = async (e) => {
    e.preventDefault();

    try {
        const email = document.getElementById('emailField').value;
        const password = document.getElementById('passwordField').value;

        let res = await axios.post(`${baseUrl}/user/login`, {email, password});
        console.log(res);
        if(res.status === 200) {
            email.value = '';
            password.value = '';
            confirm('User logged in successfully!');
            
            localStorage.setItem('token', res.data.token);
    
            window.location.href = 'chat.html';
        }   
    } catch (error) {
        console.log(error);
        if(error.response.status === 401) {
            alert('Password is incorrect!');
        }
        if(error.response.status === 404) {
            alert('user is not registered');
        }
    }
    
};

forgotBtn.onclick = async (e) => {
    window.location.href = 'forgotpassword.html';
}