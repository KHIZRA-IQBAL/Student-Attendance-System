async function Handlelogin() {

    // 1. for storing inputs into variables 

    const current_user = document.getElementById('username').value;

    const current_pass = document.getElementById('password').value;



    try {
        // checking in the function that it's working or not

        console.log("System check: " + current_user + " trying to login.");



        const auth_response = await fetch('/api/auth/login', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ username: current_user, password: current_pass })

        });



        const info = await auth_response.json();

        

 

        const check_success = info.success;



        if (check_success) {
            console.log("oh great! , now you are going to dashbored");
            

            window.location.href = 'dashboard.html';

        } else {

            

            alert("Oho! something wrong: " + (info.message));

        }

    } catch (e) {

    

        console.error("something big problem:", e);

        alert("net is not running or something wrong with server! plz check it and try again later.");

    }

}



