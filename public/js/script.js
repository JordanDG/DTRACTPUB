let ProgressCheck = 1;

function ToggleMenu() {
    const Menu = document.getElementById('mobile_menu');
    const Background = document.getElementById('mobile_overlay');
    const Icon = document.getElementById("Icon");

    if(Menu.style.display == "none") {
        Menu.style.display = "block";
        Menu.style.animation = "SlideIn 1s ease-in-out";
        Icon.className = "fa-solid fa-xmark";
    } else {
        Menu.style.display = "none";
        Icon.className = "fa-solid fa-bars";
    }

    if(Background.style.display == "none") {
        Background.style.animation = "FadeIn 1s ease-in-out";
        Background.style.display = "block";
    } else {
        Background.style.display = "none";
    }
}

function checkInputs() {
    const input1 = document.getElementById("form_password").value;
    const input2 = document.getElementById("form_password_confirm").value;
    const submitBtn = document.getElementById("SignupButton");
  
    if (input1 === input2) {
        document.getElementById("SignupButton").innerHTML = "Signup";
        submitBtn.disabled = false;
    } else {
        document.getElementById("SignupButton").innerHTML = "Passwords mismatch.";
        submitBtn.disabled = true;
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("form_password").addEventListener("keyup", checkInputs);
    document.getElementById("form_password_confirm").addEventListener("keyup", checkInputs);
});

function UpdateProgressCheck() {
    const tut_title = document.getElementById("tut_title");
    const tut_text = document.getElementById("tut_text");
    const tut_form = document.getElementById("tut_form");
    const tut_progress = document.getElementById("tut_progress");
    const replacementbtn = document.getElementById("replacementbtn");
    const completebtn = document.getElementById("completebtn");

    if(ProgressCheck == 1) {
        tut_title.innerHTML = ("How it works");
        tut_text.innerHTML = ("Upon completion of the tutorial, you'll be taken to the dashboard. This will allow you to enter, track and review your activities entered. There will also be tips available to allwo you to organically change your lifestyle habits.");
        tut_form.style.display = "none";
        tut_progress.innerHTML = "Page " + (ProgressCheck+1) + "/3";
        replacementbtn.style.display = "block";
        ProgressCheck == ProgressCheck++;
        console.log(ProgressCheck);
    } else if(ProgressCheck == 2) {
        tut_title.innerHTML = ("Weekly Reviews");
        tut_text.innerHTML = ("Each week you'll get a customised report for your weekly activity to review your progress. This'll be your best opportunity to observe measurable differences in your activities and reflect upon whether it's improved your day-to-day life.");
        tut_progress.innerHTML = "Page " + (ProgressCheck+1) + "/3";
        ProgressCheck == ProgressCheck++;
        console.log(ProgressCheck);
    } else if(ProgressCheck == 3) {
        replacementbtn.style.display = "none";
        completebtn.style.display = "block";
        ProgressCheck == 1;
        console.log(ProgressCheck);
    }
}

function ToggleOpenMenu(TabClicked) {
    // Buttons //
    const BtnTips = document.getElementById("BtnTips");
    const ActivityTips = document.getElementById("BtnActivity");
    // TabContainers //
    const contents_tips = document.getElementById("contents_tips");
    const Activity_tips = document.getElementById("contents_Activity");

    if(TabClicked == "Tips") {
        BtnTips.classList.toggle("activetab");
        ActivityTips.classList.toggle("activetab");
        contents_tips.classList.toggle("hideme");
        contents_tips.classList.remove("hideme");
        contents_tips.classList.add("showme");
        Activity_tips.classList.add("hideme");
        Activity_tips.classList.remove("showme");
    } else if(TabClicked == "Activity") {
        ActivityTips.classList.toggle("activetab");
        BtnTips.classList.toggle("activetab");
        Activity_tips.classList.remove("hideme");
        Activity_tips.classList.add("showme");
        contents_tips.classList.remove("showme");
        contents_tips.classList.add("hideme");
    }
}