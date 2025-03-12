import "./style.css";

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

function buildUserForm() {
  const form = document.getElementById("form__user") as HTMLFormElement;

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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    console.log(Object.fromEntries(formData));

    const success = await submitForm(formData);

    if (success) {
      buildUserTable();
    }
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

  createToast(json.success, json.message, response.status);

  return json.success as boolean;
}

async function buildUserTable() {
  const table = document.getElementById("user-table") as HTMLTableElement;
  table.innerHTML = "";
  const users = await getUsers();

  const headRow = table.insertRow();
  const headCellID      = headRow.insertCell();
  const headCellHexUID  = headRow.insertCell();
  const headCellName    = headRow.insertCell();

  headCellID.innerText      = "ID";
  headCellHexUID.innerText  = "Hex UID";
  headCellName.innerText    = "Name";

  for (const user of users) {
    const row = table.insertRow();
    const cellID      = row.insertCell();
    const cellHexUID  = row.insertCell();
    const cellName    = row.insertCell();

    cellID.innerText      = `#${user.id}`;
    cellHexUID.innerText  = `${user.hex_uid}`;
    cellName.innerText    = `${user.name}`;
  }
}
buildUserTable();

async function buildCheckTable() {
  const table = document.getElementById("check-table") as HTMLTableElement;
  table.innerHTML = "";
  const checks = await getChecks();

  const headRow = table.insertRow();
  const headCellID    = headRow.insertCell();
  const headCellDate  = headRow.insertCell();
  const headCellUser  = headRow.insertCell();

  headCellID.innerText    = "ID";
  headCellDate.innerText  = "Date ";
  headCellUser.innerText  = "User name (ID)";

  for (let i = checks.length - 1; i >= 0; i--) {
    const check = checks[i];
    const row = table.insertRow();
    const cellID    = row.insertCell();
    const cellDate  = row.insertCell();
    const cellUser  = row.insertCell();

    const date = new Date(check.date_time).toISOString().slice(0, 19).replace("T", " ");

    cellID.innerText    = `#${check.id}`;
    cellDate.innerText  = `${date} UTC`;
    cellUser.innerText  = `${check.user.name} (#${check.user.id})`;
  }
}
buildCheckTable();

async function getUsers(): Promise<User[]> {
  const res = await fetchGet("/user");

  return res.data;
}

async function getChecks(): Promise<Check[]> {
  const res = await fetchGet("/check");

  return res.data;
}

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
