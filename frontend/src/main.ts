import "./style.css";

const api = {
  url: import.meta.env.VITE_SERVER_IP + import.meta.env.VITE_SERVER_PORT,

  request: async (method: string, endpoint: string, body?: any) => {
    const url = api.url + endpoint;
    let config;
    if (body) {
      config = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      };
    } else {
      config = {
        method: method,
        headers: { "Content-Type": "application/json" }
      };
    }

    console.log(method, url);
    const response = await fetch(url, config);
    return response;
  }
}

type User = {
  id: number,
  hex_uid: string,
  name: string
};

type Check = {
  id: number,
  date_time: Date,
  user: User
};

class UserForm {
  formCreate: HTMLFormElement;
  formUpdate: HTMLFormElement;

  constructor(
    formCreate: HTMLFormElement,
    formUpdate: HTMLFormElement
  ) {
    this.formCreate = formCreate;
    this.formUpdate = formUpdate;

    this.init();
  }
  init() {
    this.formCreate.addEventListener("submit", async (event) => {
      event.preventDefault();
      const response = await this.submit(this.formCreate, "POST");

      if (response.ok) {
        this.formCreate.reset();
      } else {
        const json = await response.json();

        createToast(json.success, json.message, response.status);
      }
    });

    this.formUpdate.addEventListener("submit", async (event) => {
      event.preventDefault();
      const response = await this.submit(this.formUpdate, "PATCH");

      if (response.ok) {
        this.formUpdate.reset();
        this.doCreate();
      } else {
        const json = await response.json();

        createToast(json.success, json.message, response.status);
      }
    });

    // form input length indicators (0/255)
    const formInputLengths = this.formCreate.querySelectorAll(".form__input-length");
    formInputLengths.forEach((inputLength) => {
      const inputElement = inputLength.previousElementSibling as HTMLInputElement;

      inputLength.textContent = `${inputElement.value.length}/${inputElement.getAttribute("maxlength")}`;
      inputElement.addEventListener("input", () => {
        inputLength.textContent = `${inputElement.value.length}/${inputElement.getAttribute("maxlength")}`;
      });
    });

    this.doCreate();
  }
  doCreate() {
    this.formUpdate.style.display = "none";
    this.formCreate.style.display = "block";
  }
  doUpdate(currentUser: User) {
    this.formCreate.style.display = "none";
    this.formUpdate.style.display = "block";

    const idElement = this.formUpdate.elements.namedItem("id") as HTMLInputElement;
    const nameElement = this.formUpdate.elements.namedItem("name") as HTMLInputElement;
    const hex_uidElement = this.formUpdate.elements.namedItem("hex_uid") as HTMLInputElement;

    idElement.value = currentUser.id.toString();
    nameElement.value = currentUser.name;
    hex_uidElement.value = currentUser.hex_uid;
  }
  async submit(form: HTMLFormElement, method: "POST" | "PATCH") {
    const formData = new FormData(form);

    const response = await api.request(method, "/user", formData);
    
    return response;
  }
}

class CheckForm {
  formCreate: HTMLFormElement;
  formUpdate: HTMLFormElement;

  constructor(
    formCreate: HTMLFormElement,
    formUpdate: HTMLFormElement
  ) {
    this.formCreate = formCreate;
    this.formUpdate = formUpdate;

    this.init();
  }
  init() {
    this.formCreate.addEventListener("submit", async (event) => {
      event.preventDefault();
      const response = await this.submit(this.formCreate, "POST");

      if (response.ok) {
        this.formCreate.reset();
      } else {
        const json = await response.json();

        createToast(json.success, json.message, response.status);
      }
    });

    this.formUpdate.addEventListener("submit", async (event) => {
      event.preventDefault();
      const response = await this.submit(this.formUpdate, "PATCH");

      if (response.ok) {
        this.formUpdate.reset();
        this.doCreate();
      } else {
        const json = await response.json();

        createToast(json.success, json.message, response.status);
      }
    });

    // form input length indicators (0/255)
    const formInputLengths = this.formCreate.querySelectorAll(".form__input-length");
    formInputLengths.forEach((inputLength) => {
      const inputElement = inputLength.previousElementSibling as HTMLInputElement;

      inputLength.textContent = `${inputElement.value.length}/${inputElement.getAttribute("maxlength")}`;
      inputElement.addEventListener("input", () => {
        inputLength.textContent = `${inputElement.value.length}/${inputElement.getAttribute("maxlength")}`;
      });
    });

    this.doCreate();
  }
  doCreate() {
    this.formUpdate.style.display = "none";
    this.formCreate.style.display = "block";
  }
  doUpdate(currentCheck: Check) {
    this.formCreate.style.display = "none";
    this.formUpdate.style.display = "block";

    const idElement = this.formUpdate.elements.namedItem("id") as HTMLInputElement;
    const hex_uidElement = this.formUpdate.elements.namedItem("hex_uid") as HTMLInputElement;
    const date_timeElement = this.formUpdate.elements.namedItem("date_time") as HTMLInputElement;

    idElement.value = currentCheck.id.toString();
    hex_uidElement.value = currentCheck.user.hex_uid;
    date_timeElement.value = new Date().toISOString();
  }
  async submit(form: HTMLFormElement, method: "POST" | "PATCH") {
    const formData = new FormData(form);

    const response = await api.request(method, "/check", formData);
    
    return response;
  }
}

const userForm = new UserForm(
  document.getElementById("form__user__create") as HTMLFormElement,
  document.getElementById("form__user__update") as HTMLFormElement
);

const checkForm = new CheckForm(
  document.getElementById("form__check__create") as HTMLFormElement,
  document.getElementById("form__check__update") as HTMLFormElement
);

async function loadUserList(skip: number, take: number) {
  const response = await api.request("GET", `/user/range?skip=${skip}&take=${take}`);
  const json = await response.json();
  const users = json.data as User[];
  
  const tableContainer = document.getElementById("table-container__user")!;
  const tableElement = tableContainer.querySelector("table")!;

  tableElement.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Hex UID</th>
    </tr>
    ${users.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.hex_uid}</td>
      </tr>
    `).join("")}
  `;
}
loadUserList(0, 5);

async function loadCheckList(skip: number, take: number) {
  const response = await api.request("GET", `/check/range?skip=${skip}&take=${take}`);
  const json = await response.json();
  const checks = json.data as Check[];
  
  const tableContainer = document.getElementById("table-container__check")!;
  const tableElement = tableContainer.querySelector("table")!;

  console.log("checks", checks);

  tableElement.innerHTML = `
    <tr>
      <th>ID</th>
      <th>User name</th>
      <th>Date & time</th>
    </tr>
    ${checks.map(check => `
      <tr>
        <td>${check.id}</td>
        <td>${check.user.name}</td>
        <td>${check.date_time}</td>
      </tr>
    `).join("")}
  `;
}
loadCheckList(0, 5);

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
