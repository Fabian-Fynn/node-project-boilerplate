/* global sendRequest */

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  // eslint-disable-next-line
  for (const i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

$('.register-button').click(function register(ev) {
  ev.preventDefault();
  sendRequest({
    url: '/public/user/',
    method: 'POST',
    options: {
      email: $(this).siblings('.email-input').val(),
      password: $(this).siblings('.password-input').val(),
    },
  }, (err, res) => {
    if (!err) {
      setCookie('jwt', res.token);
      location.reload();
    }
  });
});

$('.login-button').click(function login(ev) {
  ev.preventDefault();
  sendRequest({
    url: '/public/user/login',
    method: 'POST',
    options: {
      email: $(this).siblings('.email-input').val(),
      password: $(this).siblings('.password-input').val(),
    },
  }, (err, res) => {
    if (!err) {
      setCookie('jwt', res.token);
      location.reload();
    }
  });
});

$(document).ready(() => {

});
