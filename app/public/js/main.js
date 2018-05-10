/* global io */

const socket = io();
let activeCard = false;

function displayMessage(type, response) {
  if (response.responseJSON && response.responseJSON.error) {
    $('.page-Flash').html(response.responseJSON.error);
  } else {
    $('.page-Flash').html(response);
  }
  $('.page-Flash').addClass(`page-Flash-${type}`);
  $('.page-Flash').slideDown();
  $('.page-Flash').css('display', 'flex');
  setTimeout(() => {
    $('.page-Flash').slideUp();
  }, 5000);
}

function sendRequest({ url, method, options }, done) {
  $.ajax({
    url,
    type: method,
    data: options,
    traditional: true,
    success: (data) => {
      done(null, data);
    },
    failure: (err, result) => {
      done(err, result);
    },
    statusCode: {
      403: (response) => {
        displayMessage('error', response);
      },
      401: (response) => {
        displayMessage('error', response);
      },
      404: (response) => {
        displayMessage('error', response);
      },
      409: (response) => {
        displayMessage('error', response);
      },
    },
  });
}

function closeCard() {
  activeCard = false;
  $('.page-card').addClass('hidden');
}

$(document).keyup((ev) => {
  if (ev.which === 27) {
    closeCard();
  }
});

$('.card-form_button_cancel').click(closeCard);

function setUser({ uid, name }) {
  localStorage.setItem('uid', uid);
  localStorage.setItem('username', name);
}

function getUser() {
  return {
    uid: localStorage.getItem('uid'),
    name: localStorage.getItem('username'),
  };
}

function findGetParameters() {
  const result = [];
  window.location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      const param = item.split('=');
      result.push(param);
    });
  return result;
}

function checkMessages() {
  const params = findGetParameters();
  params.forEach((param) => {
    switch (param[0]) {
      case 'success-msg':
        displayMessage('success', unescape(param[1]));
        break;
      case 'fail-msg':
        displayMessage('error', unescape(param[1]));
        break;
      default:
        break;
    }
  });
  const cleanUri = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  window.history.replaceState({}, document.title, cleanUri);
}

$(() => {
  $('#cr_year').html(new Date().getFullYear());
  checkMessages();
  $('.page-logoutButton').click(() => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  });
});
