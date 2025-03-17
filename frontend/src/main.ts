import "./style.css";

const api = {
  url: `${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}`,

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
      const response = await this.submit(this.formCreate, "POST", "/user");
      const json = await response.json();

      createToast(json.success, json.message, response.status);

      if (response.ok) {
        this.formCreate.reset();
      }
    });

    this.formUpdate.addEventListener("submit", async (event) => {
      event.preventDefault();
      const userID = +(this.formUpdate.elements.namedItem("id") as HTMLInputElement).value;
      const response = await this.submit(this.formUpdate, "PATCH", `/user/${userID}`);
      const json = await response.json();

      createToast(json.success, json.message, response.status);

      if (response.ok) {
        this.formUpdate.reset();
        this.doCreate();
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
  async submit(form: HTMLFormElement, method: "POST" | "PATCH", endpoint: string) {
    const formData = new FormData(form);

    const response = await api.request(method, endpoint, Object.fromEntries(formData));
    
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
      const response = await this.submit(this.formCreate, "POST", "/check");
      const json = await response.json();
      
      createToast(json.success, json.message, response.status);

      if (response.ok) {
        this.formCreate.reset();
      }
    });

    this.formUpdate.addEventListener("submit", async (event) => {
      event.preventDefault();
      const checkID = +(this.formUpdate.elements.namedItem("id") as HTMLInputElement).value;
      const response = await this.submit(this.formUpdate, "PATCH", `/check/${checkID}`);
      const json = await response.json();
      
      createToast(json.success, json.message, response.status);

      if (response.ok) {
        this.formUpdate.reset();
        this.doCreate();
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
  async submit(form: HTMLFormElement, method: "POST" | "PATCH", endpoint: string) {
    const formData = new FormData(form);

    const response = await api.request(method, endpoint, Object.fromEntries(formData));
    
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

class TableList {
  private tableContainer;
  private takeElement;
  private pagesElement;
  private buttonFirst;
  private buttonPrev;
  private buttonNext;
  private buttonLast;
  private buttonRefresh;

  private skip = 0;
  private take = 5;
  private entityCount = 0;

  private endpoint;
  private listedParams;
  private form;

  constructor(tableContainer: HTMLElement, endpoint: string, listedParams: {heading: string, getValue: (entity: any) => any}[], form: any) {
    this.tableContainer = tableContainer;
    this.takeElement = this.tableContainer.querySelector(".table__entries-per-page") as HTMLSelectElement;
    this.pagesElement = this.tableContainer.querySelector(".table__pages")!;
    this.buttonFirst = this.tableContainer.querySelector(".table__first")!;
    this.buttonPrev = this.tableContainer.querySelector(".table__prev")!;
    this.buttonNext = this.tableContainer.querySelector(".table__next")!;
    this.buttonLast = this.tableContainer.querySelector(".table__last")!;
    this.buttonRefresh = this.tableContainer.querySelector(".table__refresh")!;

    this.endpoint = endpoint;
    this.listedParams = listedParams;
    this.form = form;

    this.takeElement.addEventListener("change", () => {
      this.take = parseInt(this.takeElement.value);
      this.loadTable();
    });
    this.buttonFirst.addEventListener("click", () => {
      this.skip = 0;
      this.loadTable();
    });
    this.buttonPrev.addEventListener("click", () => {
      if (this.skip - this.take < 0) {
        return;
      }
      this.skip -= this.take;
      this.loadTable();
    });
    this.buttonNext.addEventListener("click", () => {
      if (this.skip + this.take > this.entityCount) {
        return;
      }
      this.skip += this.take;
      this.loadTable();
    });
    this.buttonLast.addEventListener("click", () => {
      this.skip = Math.floor(this.entityCount / this.take) * this.take;
      this.loadTable();
    });
    this.buttonRefresh.addEventListener("click", () => {
      this.loadTable();
    });

    this.loadTable();
  }
  async loadTable() {
    const response = await api.request("GET", `${this.endpoint}/range?skip=${this.skip}&take=${this.take}`);
    const json = await response.json();
    const entityList = json.data.list as any[];
    this.entityCount = json.data.count as number;
    const tableElement = this.tableContainer.querySelector("table")!;

    this.pagesElement.textContent = `${this.skip} - ${Math.min(this.skip + this.take, this.entityCount)} of ${this.entityCount}`;

    const rowTHs = this.listedParams.map(pSet => `<th>${pSet.heading}</th>`).join("");

    tableElement.innerHTML = /* html */`
      <tr>
        ${rowTHs}
        <th></th>
      </tr>
    `;

    for (const entity of entityList) {
      const rowDTs = this.listedParams.map((pSet) => `<td>${pSet.getValue(entity)}</td>`).join("");

      const editButton = `<button data-edit="${entity.id}">Edit</button>`;

      const entityHTML = /* html */`
        <tr>
          ${rowDTs}
          <td>
            ${this.form ? editButton : ""}
            <button data-delete="${entity.id}">Delete</button>
          </td>
        </tr>
      `

      tableElement.innerHTML += entityHTML;
    }

    if (this.form) {
      const editButtons = Array.from(tableElement.querySelectorAll("[data-edit]")) as HTMLButtonElement[];
  
      for (const button of editButtons) {
        button.addEventListener("click", () => {
          const entity = entityList.find((e) => e.id == +button.dataset.edit!);
  
          if (entity) {
            this.form.doUpdate(entity);
          }
        });
      }
    }


    const deleteButtons = Array.from(tableElement.querySelectorAll("[data-delete]")) as HTMLButtonElement[];

    for (const button of deleteButtons) {
      button.addEventListener("click", async () => {
        const id = +button.dataset.delete!

        const response = await api.request("DELETE", `${this.endpoint}/${id}`);
        const json = await response.json();

        createToast(json.success, json.message, response.status);
      });
    }
  }
}

const userList = new TableList(
  document.getElementById("table-container__user")!,
  "/user",
  [
    {heading: "ID", getValue: (e) => `#${e.id}`},
    {heading: "Name", getValue: (e) => e.name},
    {heading: "Hex UID", getValue: (e) => e.hex_uid}
  ],
  UserForm
);

const checkList = new TableList(
  document.getElementById("table-container__check")!,
  "/check",
  [
    {heading: "ID", getValue: (e) => `#${e.id}`},
    {heading: "User", getValue: (e) => `${e.user.name} (${e.user.id})`},
    {heading: "Date & Time", getValue: (e) => { return new Date(e.date_time).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) }}
  ],
  null
);

function createToast(ok: boolean, message: string, statusCode: number) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.style.setProperty("--toast-color", ok ? "green" : "red");

  const toastContainer = document.getElementById("toast-container")!;
  toastContainer.appendChild(toast);

  const svg = ok ?
    /* html */`<svg width="36" height="36" viewBox="0 0 48 48">
      <circle r="24" cx="24" cy="24" fill="#10e440" />
      <polyline points="11,24 21,34 37,18" stroke-width="4" stroke-linecap="round" stroke="white" fill="none" />
    </svg>` :
    /* html */`<svg width="36" height="36" viewBox="0 0 48 48">
      <circle r="24" cx="24" cy="24" fill="#ff4f4f" />
      <line x1="12" y1="12" x2="36" y2="36" stroke="white" stroke-width="4" />
      <line x1="36" y1="12" x2="12" y2="36" stroke="white" stroke-width="4" />
    </svg>`;


  toast.innerHTML = /* html */`
    <div class="toast__bar"></div>
    <div class="toast__svg-container">${svg}</div>
    <div class="toast__text">
      <p>${ok ? "Success" : "Error"}</p>
      <p>${message} (${statusCode})</p>
    </div>
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
