const baseUrl = `http://localhost:4000`;

document.getElementById('signupform').onsubmit = async (e) => {
    e.preventDefault();

    try {
        const name = document.getElementById('nameField').value;
        const email = document.getElementById('emailField').value;
        const phone = document.getElementById('phoneField').value;
        const password = document.getElementById('passwordField').value;

        let res = await axios.post(`${baseUrl}/user/signup`, {name, email, phone, password});
        console.log(res);
        if(res.status === 200) {
            alert('Successfuly signed up!');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.log(error);
        if(error.response.status === 403){
            alert('User already exists. Please Login.');
        }
    }
    
};