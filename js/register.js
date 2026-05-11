import {register} from './api.js'

const step0 = document.querySelector("#step-0");
const step1 = document.querySelector("#step-1");
const step2 = document.querySelector("#step-2");
const step3 = document.querySelector("#step-3");
const step4 = document.querySelector("#step-4");

function show(el) {el.classList.remove('hidden');}
function hide(el) {el.classList.add('hidden');}

const countryCodes = {
    USA: "+1",
    CANADA: "+1",
    UK: "+44",
    GERMANY: "+49",
    FRANCE: "+33",
    ITALY: "+39",
    SPAIN: "+34",
    SWITZERLAND: "+41",
    JAPAN: "+81",
    INDIA: "+91",
    CHINA: "+86",
    SOUTH_KOREA: "+82",
    GAMBIA: "+220",
    NIGERIA: "+234",
    GHANA: "+233",
    MOROCCO: "+212",
    SOUTH_AFRICA: "+27",
    ETHIOPIA: "+251",
    KENYA: "+254",
    SENEGAL: "+221",
    MALI: "+223",
    IVORY_COAST: "+225",
    BURKINA_FASO: "+226",
    CAMEROON: "+237",
    CONGO: "+242"
}

// Days
const dobDay = document.querySelector("#dobDay")
for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option")
    option.value = i
    option.textContent = i
    dobDay.appendChild(option)
}

// months
const dobMonth = document.querySelector("#dobMonth")
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
months.forEach((month, index) => {
    const option = document.createElement("option")
    option.value = index + 1
    option.textContent = month
    dobMonth.appendChild(option)
})

// Years
const dobYear = document.querySelector("#dobYear")
const currentYear = new Date().getFullYear()
for (let y = currentYear - 10; y >= 1920; y--) {
    const option = document.createElement("option")
    option.value = y
    option.textContent = y
    dobYear.appendChild(option)
}

document.querySelector("#create-account-btn").addEventListener("click", () => {
    hide(step0);
    show(step1);
});

document.querySelector("#next-1").addEventListener("click", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailError = document.querySelector("#email-error");
    const email = document.querySelector("#email").value

    if (email.trim() === '') {
        emailError.textContent = "Email is required.";
        emailError.classList.remove('hidden');
    } else if (!emailRegex.test(email)) {
        emailError.textContent = "Please enter a valid email.";
        emailError.classList.remove('hidden');
    } else {
        hide(step1);
        show(step2);
        emailError.classList.add('hidden');
    }
});

document.querySelector("#next-2").addEventListener("click", () => {
    const firstNameError = document.querySelector("#firstNameError");
    const lastNameError = document.querySelector("#lastNameError");
    const dobError = document.querySelector("#DOBError");

    const firstName = document.querySelector("#first-nameInput").value
    const lastName = document.querySelector("#last-nameInput").value
    const day = document.querySelector("#dobDay").value
    const month = document.querySelector("#dobMonth").value
    const year = document.querySelector("#dobYear").value

    const dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    const nameRegex = /^[a-zA-Z\s]+$/

    if (firstName.trim() === '') {
        firstNameError.textContent = "First name is required."
        firstNameError.classList.remove('hidden');
    } else if (!nameRegex.test(firstName)) {
        firstNameError.textContent = "First name can only contain letters."
        firstNameError.classList.remove('hidden');
    } else if (lastName.trim() === '') {
        lastNameError.textContent = "Last name is required."
        lastNameError.classList.remove('hidden');
    } else if(!nameRegex.test(lastName)) {
        lastNameError.textContent = "Last name can only contain letters."
        lastNameError.classList.remove('hidden');
    } else if (day === '' || month === '' || year === '') {
        dobError.textContent = "Please enter a valid birth date";
        dobError.classList.remove('hidden');
    } else {
        hide(step2);
        show(step3);
        firstNameError.classList.add('hidden');
        lastNameError.classList.add('hidden');
        dobError.classList.add('hidden');
    }
}); 

document.querySelector("#next-3").addEventListener("click", () => {
    const countryError = document.querySelector("#countryError");
    const phoneNumberError = document.querySelector("#phoneNumberError");

    const country = document.querySelector("#country").value
    const phoneNumber = document.querySelector("#phoneNumberInput").value

    const expectedCode = countryCodes[country];
    const phoneRegex = /^\+\d+\s?\d{7,15}$/

    if(country === '') {
        countryError.textContent = "Please select your country of residence";
        countryError.classList.remove('hidden');
    } else if (phoneNumber ==='' || phoneNumber === expectedCode) {
        phoneNumberError.textContent = "Please enter a valid phone number";
        phoneNumberError.classList.remove('hidden');
    } else if (!phoneRegex.test(phoneNumber)) {
        phoneNumberError.textContent = "Please enter a valid phone number."        
        phoneNumberError.classList.remove('hidden');
    }else {
        hide(step3);
        show(step4);
        countryError.classList.add('hidden');
        phoneNumberError.classList.add('hidden')
    }
});

document.querySelector("#country").addEventListener("change", () => {
    const country = document.querySelector("#country").value
    const phoneNumberInput = document.querySelector("#phoneNumberInput");

    if (country && countryCodes[country]) {
        phoneNumberInput.value = countryCodes[country] + " ";
    } else {
        phoneNumberInput.value = "";
    }
});

document.querySelector("#phoneNumberInput").addEventListener("input", () => {
    const country = document.querySelector("#country").value
    const phoneInput = document.querySelector("#phoneNumberInput")
    const expectedCode = countryCodes[country] + " "

    if (!phoneInput.value.startsWith(expectedCode)) {
        phoneInput.value = expectedCode
    }
});

document.querySelector("#back-to-step-0").addEventListener("click", () => {
    hide(step1);
    show(step0);
});

document.querySelector("#back-to-step-1").addEventListener("click", () => {
    hide(step2);
    show(step1);
});

document.querySelector("#back-to-step-2").addEventListener("click", () => {
    hide(step3);
    show(step2);
});

document.querySelector("#back-to-step-3").addEventListener("click", () => {
    hide(step4);
    show(step3);
});

document.querySelector("#createAccountBtn").addEventListener("click", async () => {


    const email = document.querySelector("#email").value
    const firstName = document.querySelector("#first-nameInput").value
    const lastName = document.querySelector("#last-nameInput").value
    const day = document.querySelector("#dobDay").value
    const month = document.querySelector("#dobMonth").value
    const year = document.querySelector("#dobYear").value
    const dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const country = document.querySelector("#country").value
    const phoneNumber = document.querySelector("#phoneNumberInput").value
    const password = document.querySelector("#passwordInput").value

    const passwordError = document.querySelector("#passwordError");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/

    const btn = document.querySelector("#createAccountBtn");


    if (password === ''){
        passwordError.textContent = "Password is required."
        passwordError.classList.remove('hidden');
        return;
    } else if (!passwordRegex.test(password)) {
    passwordError.textContent = "Password must contain uppercase, lowercase, number and special character."
    passwordError.classList.remove('hidden');
    return;
    }

    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`

    try {
         const data = await register(firstName, lastName, dateOfBirth, country, phoneNumber, email, password);
         window.location.href = `../pages/verify.html?phone=${phoneNumber}&code=${data.verificationCode}`
    } catch (error) {
        console.log(error.message);
        btn.disabled = false
        btn.innerHTML = "Create"
       const registerError = document.querySelector("#registerError");
       registerError.textContent = error.message;
       registerError.classList.remove('hidden');
    }
})
