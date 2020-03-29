import * as PIXI from "pixi.js";
import * as CONFIG from "./Config";

export default class StartScreen extends PIXI.Container {

    constructor(onLogin, onRegister, onGuestLogin) {
        super();
        this.visible = false;
        this.onLogin = onLogin;
        this.onRegister = onRegister;
        this.onGuestLogin = onGuestLogin;
        this.init();
    }

    init() {
        let context = this;

        let background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.5);
        background.lineStyle(2, 0x000000);
        background.drawRect(0,0,window.innerWidth,window.innerHeight);
        background.interactive = true;
        background.buttonMode = true;
        this.background = background;
        this.addChildAt(this.background, 0);

        let win = new PIXI.Graphics();
        win.x = window.innerWidth / 2 - 350;
        win.y = window.innerHeight / 2 - 250;
        win.beginFill(0xffffff, 1);
        win.lineStyle(2, 0x000000);
        win.drawRect(0,0, 700, 500);
        background.interactive = true;
        background.buttonMode = true;
        this.window = win;
        this.addChildAt(this.window, 1);

        this.loginContainer = document.getElementById("login-container");

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
        document.body.style.backgroundImage = "url("+CONFIG.URL_ASSETS+"/images/bomb_wallpaper.jpg)";
    }

    hide() {
        this.visible = false;
        this.loginContainer.style.display = "none";
        document.body.style.backgroundImage = "none";
    }

}