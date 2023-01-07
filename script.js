'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Gozie Okeke',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-09-27T17:01:17.194Z',
    '2022-10-09T23:36:17.929Z',
    '2022-10-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Nmesoma Okeke',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Daniel Okeke',
  movements: [2000, -200, 3400, -300, -20, 50, 4000, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Cynthia Okeke',
  movements: [430, 1000, 7000, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'John Okeke',
  movements: [430, -1000, 7000, 500, 90, -400, 500, -100],
  interestRate: 1,
  pin: 5555,
};
const account6 = {
  owner: 'Elizabeth Okeke',
  movements: [430, 1000, 5000, 500, -400, -500, -100, 10000],
  interestRate: 1,
  pin: 6666,
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let sorted = true

// DECLARING SINGLE ACCOUNT VARIABLE
let currentAcc;

// DISPLAYING EACH ACCOUNT
const displayAccount = (acc, sort) => {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const date = new Date(acc.movementsDates[i]);
    const calcDate = (date1, date2) => {
      return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    };

    const dayPassed = calcDate(new Date(), date);
    // console.log(dayPassed);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${Math.abs(mov)}€</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    return mov;
  });
};

// CONVERSION RATE
const euroToUSD = 1.1;

// DISPLAY SUMMARY BALANCES
const calcIncomeSummary = acc => {
  // DISPLAY SUMMARY INCOME
  const income = acc.movements
    .filter(account => account > 0)
    .reduce((acc, curAcc) => acc + curAcc, 0);

  labelSumIn.textContent = `${income}€`;

  // DISPLAY SUMMARY OUTCOME
  const outcome = acc.movements
    .filter(account => account < 0)
    .reduce((acc, curAcc) => acc + curAcc, 0);

  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  // CALCULATE THE INTEREST
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};

// CREATING USERNAME FOR EACH ACCOUNT
const createUsername = accounts =>
  accounts.forEach(
    acc =>
      (acc.username = acc.owner
        .toLocaleLowerCase()
        .split(' ')
        .map(nameIndex => nameIndex[0])
        .join(''))
  );

createUsername(accounts);

// UPDATING THE TOTAL BALANCE
const calcBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${acc.balance}€`;
  return acc.balance;
};

// UPDATING ACCOUNT
const updateAccount = acc => {
  // DISPLAY ACCOUNT
  displayAccount(acc);

  // DISPLAY TOTAL BALANCE
  calcBalance(acc);

  // DISPLAY SUMMARY BALANCE
  calcIncomeSummary(acc);
};

// CREATING LOGIN
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAcc.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    updateAccount(currentAcc);
  }
});

// TRANSFERRING MONEY
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const recieverAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    currentAcc.balance >= amount &&
    recieverAcc?.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // UPDATING DATES
    currentAcc.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    // UDATING THE ACCOUNT
    updateAccount(currentAcc);
  }
});

// REQUESTING LOAN
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount / 10)) {
    currentAcc.movements.push(amount);
    updateAccount(currentAcc);

    // UPDATING DATES
    currentAcc.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
  }
  inputLoanAmount.value = '';
});

// CLOSE ACCOUNT
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAcc.username
    );
    accounts.splice(index, 1);
    containerApp.style = 'opacity:0';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayAccount(currentAcc, (sorted = !sorted));
});

// USING ARRay style
// const [deposit, withdrawal] = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       sums[cur > 0 ? [0] : [1]] += cur;
//       return sums;
//     },
//     [0, 0]
//   );
// console.log(deposit, withdrawal);

const { deposit, withdrawal } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'deposit' : 'withdrawal'] += cur;
      return sums;
    },
    { deposit: 0, withdrawal: 0 }
  );
