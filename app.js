const classSelect = document.getElementById('classSelect');
const subjectSelect = document.getElementById('subjectSelect');
const chapterSelect = document.getElementById('chapterSelect');
const statusBox = document.getElementById('status');
const chapterInfo = document.getElementById('chapterInfo');
const chapterTitle = document.getElementById('chapterTitle');
const chapterMeta = document.getElementById('chapterMeta');
const qaList = document.getElementById('qaList');

let catalog = null;
let currentClass = null;
let currentSubject = null;
let currentSubjectData = null;

function setStatus(message) {
  statusBox.textContent = message || '';
}

function resetSelect(selectEl, placeholder) {
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  selectEl.value = '';
}

function clearChapterDisplay() {
  chapterInfo.classList.add('hidden');
  chapterTitle.textContent = '';
  chapterMeta.textContent = '';
  qaList.innerHTML = '';
}

function createOption(value, text) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  return option;
}

async function loadCatalog() {
  setStatus('Loading catalog...');
  const response = await fetch('data/catalog.json');
  if (!response.ok) {
    throw new Error('Unable to load data/catalog.json');
  }
  catalog = await response.json();

  for (const classItem of catalog.classes) {
    classSelect.appendChild(createOption(classItem.id, classItem.name));
  }
  setStatus('Catalog loaded.');
}

function onClassChange() {
  const classId = classSelect.value;
  resetSelect(subjectSelect, 'Select subject');
  resetSelect(chapterSelect, 'Select chapter');
  subjectSelect.disabled = true;
  chapterSelect.disabled = true;
  clearChapterDisplay();
  currentClass = null;
  currentSubject = null;
  currentSubjectData = null;

  if (!classId) {
    setStatus('Choose a class.');
    return;
  }

  currentClass = catalog.classes.find(item => item.id === classId);
  if (!currentClass) {
    setStatus('Selected class not found.');
    return;
  }

  currentClass.subjects.forEach(subject => {
    subjectSelect.appendChild(createOption(subject.id, subject.name));
  });

  subjectSelect.disabled = false;
  setStatus(`Loaded subjects for ${currentClass.name}.`);
}

async function onSubjectChange() {
  const subjectId = subjectSelect.value;
  resetSelect(chapterSelect, 'Select chapter');
  chapterSelect.disabled = true;
  clearChapterDisplay();
  currentSubject = null;
  currentSubjectData = null;

  if (!subjectId) {
    setStatus('Choose a subject.');
    return;
  }

  currentSubject = currentClass.subjects.find(item => item.id === subjectId);
  if (!currentSubject) {
    setStatus('Selected subject not found.');
    return;
  }

  setStatus(`Loading ${currentSubject.name}...`);
  const response = await fetch(currentSubject.file);
  if (!response.ok) {
    throw new Error(`Unable to load ${currentSubject.file}`);
  }

  currentSubjectData = await response.json();

  currentSubjectData.chapters.forEach(chapter => {
    chapterSelect.appendChild(createOption(chapter.id, chapter.title));
  });

  chapterSelect.disabled = false;
  setStatus(`Loaded chapters for ${currentSubject.name}.`);
}

function onChapterChange() {
  const chapterId = chapterSelect.value;
  clearChapterDisplay();

  if (!chapterId) {
    setStatus('Choose a chapter.');
    return;
  }

  const chapter = currentSubjectData.chapters.find(item => item.id === chapterId);
  if (!chapter) {
    setStatus('Selected chapter not found.');
    return;
  }

  chapterInfo.classList.remove('hidden');
  chapterTitle.textContent = chapter.title;
  chapterMeta.textContent = `${currentSubjectData.class.name} • ${currentSubjectData.subject.name}`;

  if (!chapter.qa || chapter.qa.length === 0) {
    qaList.innerHTML = '<div class="qa-item"><p>No questions added for this chapter yet.</p></div>';
  } else {
    qaList.innerHTML = chapter.qa.map((item, index) => `
      <article class="qa-item">
        <h3>Q${index + 1}. ${item.question}</h3>
        <p>${item.answer}</p>
      </article>
    `).join('');
  }

  setStatus(`Showing ${chapter.title}.`);
}

classSelect.addEventListener('change', onClassChange);
subjectSelect.addEventListener('change', () => {
  onSubjectChange().catch(error => {
    console.error(error);
    setStatus(error.message);
  });
});
chapterSelect.addEventListener('change', onChapterChange);

loadCatalog().catch(error => {
  console.error(error);
  setStatus(error.message);
});
