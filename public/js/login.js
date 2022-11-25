window.addEventListener("load", function (e) {
    const username = this.document.querySelector("#username");
    const password = this.document.querySelector("#password");
    const login = this.document.querySelector("#login");
    const error = this.document.querySelector(".text-error");
    let fields = [username, password];

    //setTimeout 500ms to allow the error message to be displayed
    setTimeout(function () {
        const suspended = this.document.querySelector(".text-error");
        console.log(suspended.value);
        if (suspended.value) showError(suspended, suspended.value, []);
    }, 1500);

    login.addEventListener("click", (e) => {
        e.preventDefault();

        let emptyFields = [];
        for (const input of fields) {
            if (isEmptyOrSpaces(input.value)) {
                emptyFields.push(input);
            }
        }

        if (isEmptyOrSpaces(username.value) || isEmptyOrSpaces(password.value)) {
            showError(error, "Please fill out all fields", emptyFields);
            return;
        }
        if (!username.value.match(usernameRegex)) {
            showError(error, "Please enter a valid username", [username]);
            return;
        }

        this.fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            }),
        })
            .then((res) => {
                if (res.status >= 400) {
                    showError(error, "Invalid username or password", fields);
                    return;
                }
                if (res.status == 200) window.location.replace(window.location.origin + "/");
            })
            .catch((err) => console.log(err));
    });
});
