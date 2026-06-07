import {register} from './api.js'

const step0 = document.querySelector("#step-0");
const step1 = document.querySelector("#step-1");
const step2 = document.querySelector("#step-2");
const step3 = document.querySelector("#step-3");
const step4 = document.querySelector("#step-4");

function show(el) {el.classList.remove('hidden');}
function hide(el) {el.classList.add('hidden');}

const MINIMUM_AGE = 18;

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

function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

function clearError(errorElement) {
  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}

function isValidDateOfBirth(day, month, year) {
  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));

  return (
    birthDate.getFullYear() === Number(year) &&
    birthDate.getMonth() === Number(month) - 1 &&
    birthDate.getDate() === Number(day)
  );
}

function isAtLeastMinimumAge(day, month, year) {
  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= MINIMUM_AGE;
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
for (let y = currentYear - MINIMUM_AGE; y >= 1920; y--) {
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
    clearError(emailError);
    const email = document.querySelector("#email").value.trim()

    if (email.trim() === '') {
        showError(emailError, "Email is required.")
    } else if (!emailRegex.test(email)) {
        showError(emailError, "Please enter a valid email.")
    } else {
        hide(step1);
        show(step2);
        clearError(emailError);
    }
});

document.querySelector("#next-2").addEventListener("click", () => {

    const firstNameError = document.querySelector("#firstNameError");
    clearError(firstNameError);
    const lastNameError = document.querySelector("#lastNameError");
    clearError(lastNameError);
    const dobError = document.querySelector("#DOBError");
    clearError(dobError);

    const firstName = document.querySelector("#first-nameInput").value.trim()
    const lastName = document.querySelector("#last-nameInput").value.trim()
    const day = document.querySelector("#dobDay").value
    const month = document.querySelector("#dobMonth").value
    const year = document.querySelector("#dobYear").value

    const nameRegex = /^[a-zA-Z\s]+$/

    if (firstName.trim() === '') {
        showError(firstNameError, "First name is required.");
    } else if (!nameRegex.test(firstName)) {
        showError(firstNameError, "First name can only contain letters.");
    } else if (lastName.trim() === '') {
        showError(lastNameError, "Last name is required.");
    } else if(!nameRegex.test(lastName)) {
        showError(lastNameError, "Last name can only contain letters.");
    } else if (day === '' || month === '' || year === '') {
        showError(dobError, "Please enter a valid birth date");
    } else if (!isValidDateOfBirth(day, month, year)){
        showError(dobError, "Please enter a real birth date");
    } else if (!isAtLeastMinimumAge(day, month, year)){
        showError(dobError, `You must be at least ${MINIMUM_AGE} years old.`);
    } else {
        hide(step2);
        show(step3);
        clearError(firstNameError);
        clearError(lastNameError);
        clearError(dobError);
    }
}); 

document.querySelector("#next-3").addEventListener("click", () => {


    const countryError = document.querySelector("#countryError");
    clearError(countryError);
    const phoneNumberError = document.querySelector("#phoneNumberError");
    clearError(phoneNumberError);

    const country = document.querySelector("#country").value
    const phoneNumber = document.querySelector("#phoneNumberInput").value.trim()

    const expectedCode = countryCodes[country];
    const expectedPrefix = expectedCode ? `${expectedCode} ` : "";
    const phoneRegex = /^\+\d+\s?\d{7,15}$/

    if(country === '') {
        showError(countryError, "Please select your country of residence.");
    } else if (phoneNumber ==='' || phoneNumber === expectedCode) {
        showError(phoneNumberError, "Please enter a valid phone number.");
    } else if(!phoneNumber.startsWith(expectedPrefix)){
        showError(phoneNumberError, `Phone number must start with ${expectedCode}.`);
    } else if (!phoneRegex.test(phoneNumber)) {
        showError(phoneNumberError, "Please enter a valid phone number.");
    }else {
        hide(step3);
        show(step4);
        clearError(countryError)
        clearError(phoneNumberError)
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
    const expectedCode = countryCodes[country];
    
    if (!country || !expectedCode) {return;}

    const expectedPrefix = expectedCode + " ";

    if (!phoneInput.value.startsWith(expectedPrefix)) {
        phoneInput.value = expectedPrefix;
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
document.querySelector("#login-btn").addEventListener("click", () => {
    window.location.href = "../pages/login.html";
})

document.querySelector("#createAccountBtn").addEventListener("click", async () => {

    const email = document.querySelector("#email").value.trim()
    const firstName = document.querySelector("#first-nameInput").value.trim()
    const lastName = document.querySelector("#last-nameInput").value.trim()
    const day = document.querySelector("#dobDay").value
    const month = document.querySelector("#dobMonth").value
    const year = document.querySelector("#dobYear").value
    const dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const country = document.querySelector("#country").value
    const phoneNumber = document.querySelector("#phoneNumberInput").value.trim();
    const password = document.querySelector("#passwordInput").value

    const passwordError = document.querySelector("#passwordError");
    const registerError = document.querySelector("#registerError");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/

    const btn = document.querySelector("#createAccountBtn");
    clearError(passwordError);
    clearError(registerError)


    if (password === ''){
        showError(passwordError, "Password is required.");
        return;
    } else if (!passwordRegex.test(password)) {
        showError(passwordError, "Password must contain uppercase, lowercase, number, and special character.");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`

    try {
        const data = await register(firstName, lastName, dateOfBirth, country, phoneNumber, email, password);

        if (data.verificationCode) {
            sessionStorage.setItem("demoVerificationCode", data.verificationCode);
        }

        window.location.href = `../pages/verify.html?phone=${encodeURIComponent(phoneNumber)}`
    } catch (error) {
        console.log(error.message);
        btn.disabled = false
        btn.innerHTML = "Create"
       showError(registerError, error.message);
    }
})
