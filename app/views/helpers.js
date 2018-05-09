exports.eq = function (param, value) {
  return (param && param === value);
};

exports.or = function (a, b) {
  return (a || b);
};

exports.link = function (target) {
  return "href='" + target + "'";
};

exports.hasRole = function (UserRoles, expectedRole) {
  if (!UserRoles) {
    return false;
  }
  return (UserRoles.indexOf(expectedRole) > -1);
};

exports.hasNotRole = function (UserRoles, expectedRole) {
  if (!UserRoles) {
    return false;
  }
  return (UserRoles.indexOf(expectedRole) === -1);
};

exports.arrayToString = function (array) {
  let out = '';

  for (let i = 0; i < array.length; i++) {
    out = out + array[i];

    out += (i !== (array.length - 1) ? ', ' : '');
  }

  return out;
};

exports.restartDetails = function (details) {
  return `data-activeRestartAction=${details.activeAction} data-bash-host="${details.bash.host}"`;
};
