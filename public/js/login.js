window.addEventListener("load", function(e){
    const email = this.document.querySelector("#email");
    const password = this.document.querySelector("#password");
    const login = this.document.querySelector("#login");
    const error = this.document.querySelector(".text-error");
    let fields = [email, password];

    login.addEventListener("click", (e)=> {
        e.preventDefault();

        let emptyFields = [];
        for(const input of fields){
            if(isEmptyOrSpaces(input.value)){
                emptyFields.push(input);
            }
        }

        if(isEmptyOrSpaces(email.value) || isEmptyOrSpaces(password.value)){
            showError(error, "Please fill out all fields.", emptyFields);
            return;
        }
        if(!email.value.match(emailRegex)){
            showError(error, "Please enter a valid email.",[email]);
            return;
        }

        this.fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        }).then(res => {
            if(res.status >= 400){
                showError(error, "Invalid email or password.", fields);
                return;
            }
            if(res.status == 200)
                this.window.location.href = window.location.origin + "/home";
        }).catch(err => console.log(err))
    });
});
