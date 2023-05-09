// window.localStorage.removeItem('students')

let allStudentsArray = JSON.parse(localStorage.getItem('students')) || [
    {
    name: 'Ben'.toLowerCase(),
    surname: 'Doak'.toLowerCase(),
    middleName: 'Gannon'.toLowerCase(),
    birthdate: '2005-11-11',
    startYear: 2022,
    faculty: 'Frontend'.toLowerCase(),
  },
    {
    name: 'Cristiano'.toLowerCase(),
    surname: 'Ronaldo'.toLowerCase(),
    middleName: 'Santos'.toLowerCase(),
    birthdate: '1985-02-05',
    startYear: 2008,
    faculty: 'Sport'.toLowerCase(),
  },
  {
    name: 'Ibrahima'.toLowerCase(),
    surname: 'Konate'.toLowerCase(),
    middleName: '',
    birthdate: '1999-05-25',
    startYear: 2017,
    faculty: 'Tourism'.toLowerCase(),
  },
  {
    name: 'Lionel'.toLowerCase(),
    surname: 'Messi'.toLowerCase(),
    middleName: 'Andres'.toLowerCase(),
    birthdate: '1987-06-24',
    startYear: 2008,
    faculty: 'Management'.toLowerCase(),
  },
  {
    name: 'Harvey'.toLowerCase(),
    surname: 'Elliott'.toLowerCase(),
    middleName: 'Daniel'.toLowerCase(),
    birthdate: '2003-04-04',
    startYear: 2020,
    faculty: 'Marketing'.toLowerCase(),
  },
  {
    name: 'Fabio'.toLowerCase(),
    surname: 'Carvalho'.toLowerCase(),
    middleName: 'Leandro'.toLowerCase(),
    birthdate: '2002-08-30',
    startYear: 2019,
    faculty: 'Tourism'.toLowerCase(),
  },
];

// Variables
const table = document.querySelector('tbody');
const currentDate = new Date();
let sortKey = 'fullName';
let sortChange = true;
let timeout;

// Form
const form = document.querySelector('form');
const nameInput = document.getElementById('name-input');
const surnameInput = document.getElementById('surname-input');
const middlenameInput = document.getElementById('middlename-input');
const birthdateInput = document.getElementById('birthdate-input');
const startyearInput = document.getElementById('startdate-input');
const facultyInput = document.getElementById('faculty-input');
const buttonForm = document.getElementById('add-button')

birthdateInput.max = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate();
startyearInput.max = currentDate.getFullYear();

// Filter field
const filterForm = document.getElementById('filter-form');
const fullNameFilterInput = document.getElementById('name-filter');
const facultyFilterInput = document.getElementById('faculty-filter');
const startYearFilterInput = document.getElementById('startyear-filter');
const finishYearFilterInput = document.getElementById('finishyear-filter');
const clearFilterButton = document.getElementById('filter-button');

startYearFilterInput.max = currentDate.getMonth() > 7 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
finishYearFilterInput.max = currentDate.getFullYear() + 4;


function first(arr) {
  table.innerHTML = '';
  let shownStudentsArray = [...arr];

  shownStudentsArray.forEach(student => {
    student.fullName = student.surname + student.name + student.middleName;
    student.finishYear = parseInt(student.startYear) + 4;
  })

  shownStudentsArray = shownStudentsArray.sort(function (a, b) {
    let sortTerm = a[sortKey] < b[sortKey];
    if (sortChange == false) sortTerm = a[sortKey] > b[sortKey];
    if (sortTerm) return - 1
  })

  if (fullNameFilterInput.value.trim().length > 2) { shownStudentsArray = filterString(shownStudentsArray, 'fullName', fullNameFilterInput.value.toLowerCase()) };
  if (facultyFilterInput.value.trim().length > 2) { shownStudentsArray = filterString(shownStudentsArray, 'faculty', facultyFilterInput.value.toLowerCase()) };
  if (startYearFilterInput.value.length > 3) {
    if (startYearFilterInput.value > startYearFilterInput.max) { startYearFilterInput.value = startYearFilterInput.max };
    if (startYearFilterInput.value < startYearFilterInput.min) { startYearFilterInput.value = startYearFilterInput.min };
    shownStudentsArray = filterNumbers(shownStudentsArray, 'startYear', startYearFilterInput.value)
  };
  if (finishYearFilterInput.value.length > 3) {
    if (finishYearFilterInput.value > finishYearFilterInput.max) { finishYearFilterInput.value = finishYearFilterInput.max };
    if (finishYearFilterInput.value < finishYearFilterInput.min) { finishYearFilterInput.value = finishYearFilterInput.min };
    shownStudentsArray = filterNumbers(shownStudentsArray, 'finishYear', finishYearFilterInput.value)
  };

  shownStudentsArray.forEach(student => createTableRow(student));
}

first(allStudentsArray)


function checkSymbols(elem, fieldName) {
  if (elem.value.length > 0) {
    let regex = /^[a-zA-Z '-.]+$/;
    if (regex.test(elem.value) === false) {
      elem.nextElementSibling.textContent = fieldName + ' is incorrect';
      elem.classList.add('error-message');
      return false;
    } else {
      elem.nextElementSibling.textContent = fieldName;
      elem.classList.remove('error-message');
      return true;
    }
  } else {
    elem.nextElementSibling.textContent = fieldName;
    elem.classList.remove('error-message');
    return true;
  }
}

function checkIsEmpty(elem, fieldName, func) {
  if (elem.value.trim() == '') {
    elem.nextElementSibling.textContent = fieldName + ' is not entered';
    elem.classList.add('error-message');
    return false;
  } else return func(elem, fieldName)
}

function checkNumber(elem, fieldName) {
  const value = parseInt(elem.value)
  const max = parseInt(elem.max)
  const min = parseInt(elem.min)

  if (value > max) {
    elem.nextElementSibling.textContent = fieldName + ' is too high';
    elem.classList.add('error-message');
    return false;
  } else if (value < min) {
    elem.nextElementSibling.textContent = fieldName + ' is too low';
    elem.classList.add('error-message');
    return false;
  } else {
    elem.nextElementSibling.textContent = fieldName;
    elem.classList.remove('error-message');
    return true;
  }
}


form.addEventListener('submit', function (e) {
  e.preventDefault();

  const checkName = checkIsEmpty(nameInput, 'Name', checkSymbols);
  const checkSurname = checkIsEmpty(surnameInput, 'Surname', checkSymbols);
  const checkMiddlename = checkSymbols(middlenameInput, 'Middle name');
  const checkBirthdate = checkIsEmpty(birthdateInput, 'Birthdate', checkNumber);
  const checkStartyear = checkIsEmpty(startyearInput, 'Start year', checkNumber);
  const checkFaculty = checkIsEmpty(facultyInput, 'Faculty', checkSymbols);

  if (checkName & checkSurname & checkMiddlename & checkBirthdate & checkStartyear & checkFaculty) {
    addStudent();
    form.reset();
  } else return
})

function addStudent() {
  const newStudent = {
    name: nameInput.value.trim().toLowerCase(),
    surname: surnameInput.value.trim().toLowerCase(),
    middleName: middlenameInput.value.trim().toLowerCase(),
    birthdate: birthdateInput.valueAsDate,
    startYear: startyearInput.value,
    faculty: facultyInput.value.trim().toLowerCase(),
  }
  allStudentsArray.push(newStudent);
  localStorage.setItem('students', JSON.stringify(allStudentsArray));
  first(allStudentsArray)
}

function createTableRow(student) {
  const tableRow = document.createElement('tr');
  const fullNameCell = document.createElement('td');
  const facultyCell = document.createElement('td');
  const birthdateCell = document.createElement('td');
  const studingYearsCell = document.createElement('td');
  const birthDate = new Date(student.birthdate)
  fullNameCell.textContent = upFirstLetter(student.surname) + ' ' + upFirstLetter(student.name) + ' ' + upFirstLetter(student.middleName)
  facultyCell.textContent = upFirstLetter(student.faculty);
  birthdateCell.textContent = new Intl.DateTimeFormat('ru-RU').format(birthDate) + ' (' + age(birthDate) + ' years)';
  studingYearsCell.textContent = studingYears(student.startYear);

  table.append(tableRow);
  tableRow.append(fullNameCell);
  tableRow.append(facultyCell);
  tableRow.append(birthdateCell);
  tableRow.append(studingYearsCell);
}

function upFirstLetter(string) {
  if (string.length == 0) return ''
  else return string[0].toUpperCase() + string.slice(1);
}

function age(birthdate) {
  const birthDateThisYear = new Date(currentDate.getFullYear(), birthdate.getMonth(), birthdate.getDate());
  const age = currentDate >= birthDateThisYear ? currentDate.getFullYear() - birthdate.getFullYear()
    : currentDate.getFullYear() - birthdate.getFullYear() - 1;
  return age
}

function studingYears(startYear) {
  const whichYear = currentDate.getMonth() > 7 ? currentDate.getFullYear() - startYear + 1 : currentDate.getFullYear() - startYear;
  const whichYearString = whichYear == 1 ? 'first year'
    : whichYear == 2 ? 'second year'
      : whichYear == 3 ? 'third year'
        : whichYear == 4 ? 'last year'
          : 'finished';
  return startYear + '-' + (parseInt(startYear) + 4) + ' (' + whichYearString + ')';
}

// Sort
const nameSort = document.getElementById('theader-name');
const facultySort = document.getElementById('theader-faculty');
const birthdateSort = document.getElementById('theader-age');
const startYearSort = document.getElementById('theader-start');

nameSort.addEventListener('click', function () {
  sortKey = 'fullName';
  sortChange = !sortChange;
  first(allStudentsArray);
})

facultySort.addEventListener('click', function () {
  sortKey = 'faculty';
  sortChange = !sortChange;
  first(allStudentsArray);
})

birthdateSort.addEventListener('click', function () {
  sortKey = 'birthdate';
  sortChange = !sortChange;
  first(allStudentsArray);
})

startYearSort.addEventListener('click', function () {
  sortKey = 'startYear';
  sortChange = !sortChange;
  first(allStudentsArray);
})


// Filter
function delayedFilter(func, arr) {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(func, 600, arr);
}

function filterString(arr, key, value) {
  return arr.filter(student => student[key].includes(value))
}

function filterNumbers(arr, key, value) {
  return arr.filter(student => student[key] == value);
}

filterForm.addEventListener('submit', function(e) {
  e.preventDefault();
})

fullNameFilterInput.addEventListener('input', function () {
  delayedFilter(first, allStudentsArray);
})

facultyFilterInput.addEventListener('input', function () {
  delayedFilter(first, allStudentsArray);
})

startYearFilterInput.addEventListener('input', function () {
  delayedFilter(first, allStudentsArray);
})

finishYearFilterInput.addEventListener('input', function () {
  delayedFilter(first, allStudentsArray);
})

clearFilterButton.addEventListener('click', function() {
  filterForm.reset();
  first(allStudentsArray);
})
