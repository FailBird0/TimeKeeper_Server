import "./style.css";

type User = {
  id: number,
  hex_uid: string,
  name: string
};

const buildUserForm = () => {
  const form = document.getElementById("form__user")!;

  form.innerHTML = /* html */`
    <fieldset>
      <legend>Add a new User</legend>

      <div>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" maxlength="255" required>
        <span class="form__input-length"></span>
      </div>
      <div>
        <label for="hex_uid">Hex UID</label>
        <input type="text" id="hex_uid" name="hex_uid" pattern="[a-fA-F0-9]+" maxlength="255" required>
        <span class="form__input-length"></span>
      </div>

      <button type="submit">Submit</button>
    </fieldset>
  `;

  // form input length indicators (0/255)
  const formInputLengths = form.querySelectorAll(".form__input-length");
  formInputLengths.forEach((inputLength) => {
    const inputElement = inputLength.previousElementSibling as HTMLInputElement;

    inputLength.textContent = `${inputElement.value.length}/${inputElement.getAttribute("maxlength")}`;
    inputElement.addEventListener("input", () => {
      inputLength.textContent = `${inputElement.value.length}/${inputElement.getAttribute("maxlength")}`;
    });
  });

  // actual submit logic
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    console.log(Object.fromEntries(formData));

    submitForm(formData);
  });
};

async function submitForm(formData: FormData) {
  const ip = import.meta.env.VITE_SERVER_IP + import.meta.env.VITE_SERVER_PORT + "/user";

  const config = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData))
  };

  const response = await fetch(ip, config);
  const json = await response.json();

  createToast(json.success, json.message, json.statusCode);
}

async function getUsers() {
  const users: User[] = await fetchGet("/user");

  return users;
}
console.log(await getUsers());

async function getChecks() {
  const users: User[] = await fetchGet("/check");

  return users;
}
console.log(await getUsers());

async function fetchGet(query: string) {
  const ip = import.meta.env.VITE_SERVER_IP + import.meta.env.VITE_SERVER_PORT + query;

  const config = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  const response = await fetch(ip, config);
  const json = await response.json();

  return json;
}

function createToast(ok: boolean, message: string, statusCode: number) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.style.setProperty("--toast-color", ok ? "green" : "red");
  document.body.appendChild(toast);

  const svg = ok ?
    `<svg width="48" height="48" viewBox="0 0 48 48">
      <circle r="24" cx="24" cy="24" fill="#10e440" />
      <polyline points="11,24 21,34 37,18" stroke-width="4" stroke-linecap="round" stroke="white" fill="none" />
    </svg>` :
    `<svg width="48" height="48" viewBox="0 0 48 48">
      <circle r="24" cx="24" cy="24" fill="#ff4f4f" />
      <line x1="12" y1="12" x2="36" y2="36" stroke="white" stroke-width="4" />
      <line x1="36" y1="12" x2="12" y2="36" stroke="white" stroke-width="4" />
    </svg>`;


  toast.innerHTML = /* html */`
    <div class="toast__bar"></div>
    <div class="toast__svg-container">${svg}</div>
    <div><p>${ok ? "Success" : "Error"}</p><small>${message} (${statusCode})</small></div>
  `;

  function closeToast() {
    toast.remove();
  }

  const closeToastElement = document.createElement("div");
  closeToastElement.classList.add("toast__close");

  closeToastElement.onclick = () => {
    closeToast();
  }

  closeToastElement.innerText = "X";
  toast.appendChild(closeToastElement);

  setTimeout(() => {
    try { closeToast() }
    catch (error) { /* Do nothing */ }
  }, 5000);
}

buildUserForm();
