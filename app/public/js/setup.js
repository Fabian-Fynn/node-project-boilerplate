
const players = [];

const appendPlayer = (name, selected) => {
  $('#playerList').append(`<div class="form-check">\
    <input class="form-check-input" type="checkbox" value="" id="" checked=${selected}>\
    <label class="form-check-label" for="defaultCheck1">\
      ${name}\
    </label>\
  </div>`);
};

const createNewPlayer = (name) => {
  const newPlayer = {
    name,
    currentTarget: 1,
    gamesPlayed: 0,
    gamesWon: 0,
  };
  players.push(newPlayer);
  appendPlayer(name, true);
};

$('#newPlayerForm').submit((el) => {
  createNewPlayer($('#nameInput').val());
  $('#nameInput').val('');
  el.preventDefault();
});

