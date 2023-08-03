const baseUrl = `http://localhost:4000`;

document.getElementById('add-member-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const groupId = sessionStorage.getItem('addToGroup');
        const token = localStorage.getItem('token');
        const email = document.getElementById('email').value;
        let res = await axios.post(`${baseUrl}/admin/addUser`, 
            {
                groupId: groupId,
                email: email
            }, 
            {
                headers: {
                    'Authorization': token
                }
        });
        console.log(res);
        if(res.status === 200) {
            confirm('Added new member to group.');
            window.location.href = 'chat.html';
        }
    } catch (error) {
        console.log(error);
        if(error.response.status === 400) {
            alert('The person you are trying to add is not registered.');
        } else if (error.response.status === 403) {
            alert('You dont have required permissions.');
        }
    }
};