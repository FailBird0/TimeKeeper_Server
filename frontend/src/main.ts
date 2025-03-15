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

const userList = {
  tableContainer: document.getElementById("table-container__user")!,
  skip: 0,
  take: 5,

  get takeElement() {
    return this.tableContainer.querySelector(".table__entries-per-page")!;
  },
  get pagesElement() {
    return this.tableContainer.querySelector(".table__pages")!;
  },
  get buttonPrev() {
    return this.tableContainer.querySelector(".table__prev")!;
  },
  get buttonNext() {
    return this.tableContainer.querySelector(".table__next")!;
  },

  init() {
    userList.buttonPrev.addEventListener("click", () => {
      if (userList.skip - userList.take < 0) {
        return;
      }
      userList.skip -= userList.take;
      userList.loadTable();
    });
    userList.buttonNext.addEventListener("click", () => {
      userList.skip += userList.take;
      userList.loadTable();
    });

    this.loadTable();
  },

  async loadTable() {
    const response = await api.request("GET", `/user/range?skip=${userList.skip}&take=${userList.take}`);
    const json = await response.json();
    const users = json.data.users as User[];
    const userCount = json.data.count as number;
    const tableElement = userList.tableContainer.querySelector("table")!;

    userList.pagesElement.textContent = `${userList.skip} - ${Math.min(userList.skip + userList.take, userList.skip + userCount)} of ${userCount}`;

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
};

userList.init();

const checkList = {
  tableContainer: document.getElementById("table-container__check")!,
  skip: 0,
  take: 5,

  get takeElement() {
    return this.tableContainer.querySelector(".table__entries-per-page")!;
  },
  get pagesElement() {
    return this.tableContainer.querySelector(".table__pages")!;
  },
  get buttonPrev() {
    return this.tableContainer.querySelector(".table__prev")!;
  },
  get buttonNext() {
    return this.tableContainer.querySelector(".table__next")!;
  },

  init() {
    checkList.buttonPrev.addEventListener("click", () => {
      if (checkList.skip - checkList.take < 0) {
        return;
      }
      checkList.skip -= checkList.take;
      checkList.loadTable();
    });
    checkList.buttonNext.addEventListener("click", () => {
      checkList.skip += checkList.take;
      checkList.loadTable();
    });

    this.loadTable();
  },

  async loadTable() {
    const response = await api.request("GET", `/check/range?skip=${checkList.skip}&take=${checkList.take}`);
    const json = await response.json();
    const checks = json.data.checks as Check[];
    const checkCount = json.data.count as number;
    const tableElement = checkList.tableContainer.querySelector("table")!;

    checkList.pagesElement.textContent = `${checkList.skip} - ${Math.min(checkList.skip + checkList.take, checkList.skip + checkCount)} of ${checkCount}`;

    tableElement.innerHTML = `
      <tr>
        <th>ID</th>
        <th>User name</th>
        <th>Date & Time</th>
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
};

checkList.init();

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
