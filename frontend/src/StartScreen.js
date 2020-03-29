import * as PIXI from "pixi.js";
import * as CONFIG from "./Config";
import "particles.js";

export default class StartScreen extends PIXI.Container {

    constructor(onLogin, onRegister, onGuestLogin) {
        super();
        this.visible = false;
        this.onLogin = onLogin;
        this.onRegister = onRegister;
        this.onGuestLogin = onGuestLogin;
        this.init();
        this.interactive = false;
        this.buttonMode = false;
    }

    init() {
        let context = this;

        particlesJS.load("particles-js", CONFIG.URL_ASSETS+"/particles.json", function() {
            console.log("particles loaded");
        });

        // sets the favicon
        let favicon = document.createElement("link");
        favicon.type = "image/x-icon";
        favicon.rel = "shortcut icon";
        favicon.href = CONFIG.URL_ASSETS+"/favicon.ico";
        document.head.appendChild(favicon);
        let favicon2 = document.createElement("link");
        favicon2.type = "image/x-icon";
        favicon2.rel = "icon";
        favicon2.href = CONFIG.URL_ASSETS+"/favicon.ico";
        document.head.appendChild(favicon2);

        // sets the pixel font
        let newStyle = document.createElement("style");
        newStyle.appendChild(document.createTextNode("\
            @font-face {\
                font-family: PixelFont;\
                src: url('" + CONFIG.URL_ASSETS + "/fonts/PixelFont.ttf');\
            }\
        "));
        document.head.appendChild(newStyle);

        this.loginContainer = document.getElementById("login-container");
        this.loginContainer.style.fontFamily = "PixelFont";

        let loginCon = document.getElementById("login-con");
        let registerCon = document.getElementById("register-con");

        let loginButton = document.getElementById("btn-login");
        loginButton.addEventListener("click", function() {
            let username = document.getElementById("input-name").value;
            let password = document.getElementById("input-password").value;

            if (!username || !password) {
                return;
            }

            context.onLogin(username, password);
        });

        let registerButton = document.getElementById("btn-register");
        registerButton.addEventListener("click", function() {
            let username = document.getElementById("input-register-username").value;
            let password1 = document.getElementById("input-register-password1").value;
            let password2 = document.getElementById("input-register-password2").value;
            let email = document.getElementById("input-register-email").value;

            // TODO: create better check for validity of input
            if (!username || !password1 || !password2 || !email || password1 !== password2) {
                console.log("error while registering new user");
                return;
            }

            context.onRegister(username, password1, email);
        });

        let loginGuestButton = document.getElementById("btn-guest");
        loginGuestButton.addEventListener("click", function(){
            context.onGuestLogin();
        });

        let switchToRegister = document.getElementById("btn-other-register");
        switchToRegister.addEventListener("click", function () {
            loginCon.style.display = "none";
            registerCon.style.display = "block";
        });

        let switchToLogin = document.getElementById("btn-other-login");
        switchToLogin.addEventListener("click", function () {
            registerCon.style.display = "none";
            loginCon.style.display = "block";
        });
    }

    show() {
        this.visible = true;
        this.loginContainer.style.display = "block";
        document.body.style.backgroundImage = "url("+CONFIG.URL_ASSETS+"/images/sweeper-background.png)";
        document.getElementById("partcles-js").style.display = "block";
    }

    hide() {
        this.visible = false;
        this.loginContainer.style.display = "none";
        document.body.style.backgroundImage = "none";
        document.getElementById("particles-js").style.display = "none";
    }

}