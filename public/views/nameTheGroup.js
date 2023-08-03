const baseUrl = `http://localhost:4000`;

document.getElementById('group-name-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const groupname = document.getElementById('groupname');
        const token = localStorage.getItem('token');
        const res = await axios.post(`${baseUrl}/chat/nameTheGroup`, 
            {groupname: groupname.value, groupid: sessionStorage.getItem('createdGroupId')},
            {
                headers: {
                    'Authorization': token
                } 
            } 
        );
        console.log('naming grp response:', res);
        if(res.status === 200) {
            confirm('Created New Group.');
            window.location.href = 'chat.html';
        }
    } catch (error) {
        console.log(error);
    }
};