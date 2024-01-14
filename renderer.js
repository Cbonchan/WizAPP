function toggleSwitch(switchName) {
  const switchBtn = document.getElementById(switchName);
  switchBtn.addEventListener('change', () => {
    window.electronAPI.toggleBulb();
  });
}

function getLight() {
  window.electronAPI.bulbStateRequest();
  window.electronAPI.bulbStateResponse((event, res) => {
    console.log(res);
    if (res) {
      document.querySelector('.edit').classList.remove('visually-hidden');
      document.querySelector('.lights').innerHTML = `
      <div class="row">
      <div class="col-sm-4 w-50">
      <div class="d-flex p-2 align-items-center gap-2 text-white rounded bg-primary bg-opacity-25 border border-2 border-primary fw-bold">
        <div class="rounded rounded-circle p-3">
            <i class="fa-solid fa-lightbulb fa-2xl"></i>
        </div>
        <div class="d-flex justify-content-between flex-fill bulb">
            <span>${res.name || res.moduleName}</span>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="lightSwitch" ${
                  res.state ? 'checked' : ''
                }>
                <label class="form-check-label" for="lightSwitch"></label>
            </div>
        </div>
    </div>
    </div>
    </div>`;
    }
    toggleSwitch('lightSwitch');
  });

  document.querySelector('.lights').innerHTML = `
  <div class="row">
  <div class="col-sm-4 w-50">
  <div class="d-flex p-2 align-items-center gap-2 text-white rounded bg-primary bg-opacity-25 border border-2 border-primary fw-bold">
    <div class="rounded rounded-circle p-3">
        <i class="fa-solid fa-lightbulb fa-2xl"></i>
    </div>
    <div class="d-flex justify-content-between flex-fill bulb align-items-center">
        <span>Searching bulb...</span>
        <div class="spinner-border text-white" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</div>
</div>
</div>`;
}

// TODO: Add manually bulb

let editActive = false;

function disableEdit() {
  const input = document.querySelector('.inputEdit');
  const bulb = document.querySelector('.bulb');

  const newName = input.value;
  window.electronAPI.setBulbName(newName);

  const span = document.createElement('span');
  span.innerText = newName;
  bulb.replaceChild(span, bulb.childNodes[1]);
  editActive = false;
}

function editName() {
  const editBtn = document.querySelector('.edit i');
  editBtn.classList.toggle('fa-pencil');
  editBtn.classList.toggle('fa-floppy-disk');

  if (!editActive) {
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('inputEdit');

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        editBtn.classList.toggle('fa-pencil');
        editBtn.classList.toggle('fa-floppy-disk');
        disableEdit();
      }
    });

    const bulb = document.querySelector('.bulb');
    input.value = bulb.childNodes[1].innerText;
    bulb.replaceChild(input, bulb.childNodes[1]);
    editActive = true;
  } else {
    disableEdit();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  getLight();
  document.querySelector('.redirect').addEventListener('click', () => {
    window.electronAPI.visitAuthor();
  });
  document.querySelector('.edit').addEventListener('click', () => {
    editName();
  });
});
