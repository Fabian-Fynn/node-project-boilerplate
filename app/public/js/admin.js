function updateUser(options) {
  sendRequest({ url: `/admin/user/${options.id}`, method: 'PUT', options },
    (err, data) => {
      if (err) {
        return console.error(err);
      }
      location.reload();
    });
}

$('.item_save-button').click(function () {
  if ($(this).hasClass('fa-floppy-o')) {
    const id = $(this).attr('data-id');
    const $roles = $(`.item-roles[data-id=${id}]`);
    const roles = $roles.val().replace(/\s/g, "").split(',');
    const name = $(`.item-name[data-id=${id}]`).val();

    updateUser({ id, roles, name });
  }
});

$('.item-roles, .item-name').keyup(function (e) {
  const key = e.which;

  const id = $(this).attr('data-id');
  if ($(this).val() != $(this)[0].defaultValue) {
    $(`.item_save-button[data-id=${id}]`).show();
  } else {
    $(`.item_save-button[data-id=${id}]`).hide();
  }
});

$('.page-button_user_remove_provisional').click(() => {
  sendRequest({ url: '/admin/user/remove-provisional', method: 'DELETE' },
    () => {
      location.reload();
    });
});

$('.item_delete-button').click(function () {
  const id = $(this).attr('data-id');
  const $item = $(`.page-userOverview_item_data[data-id=${id}]`);
  const mail = $item.attr('data-usermail');
  const $card = $('.page-card_message-card');

  $card.attr('data-id', id);
  $card.attr('data-usermail', mail);
  $card.find('.card-usermail').html(mail);
  $card.find('input').val('');
  $card.removeClass('hidden');
  $card.find('.page-card_confirm-usermail').focus();
});

$('.card-form_button_delete').click(function (el) {
  const $card = $(this).parents('.page-card');
  sendRequest({
    url: `/admin/user/${$card.attr('data-id')}`,
    method: 'DELETE',
  },
    () => {
      location.reload();
    });
});

$('.page-card_confirm-usermail').keyup(function (ev) {
  const mail = $(this).parent().attr('data-usermail').toLowerCase();
  const val = $(this).val().toLowerCase();

  if (ev.which === 13 && mail === val) {
    $(this).siblings('.card-form_button_delete').click();
    return;
  }

  if (mail === val) {
    $(this).siblings('.card-form_button_delete').prop('disabled', false);
  } else {
    $(this).siblings('.card-form_button_delete').prop('disabled', true);
  }
});

$('.item_promote-button').click(function () {
  const id = $(this).attr('data-id');
  const $item = $(`.page-userOverview_item_data[data-id=${id}]`);
  let roles = $item.attr('data-roles').split(',');

  const filter = role => role !== 'provisional';

  roles = roles.filter(filter);

  roles.push('dev');

  updateUser({ id, roles });
});

$(document).ready(function () {
  const $roles = $('.item-roles');
  $roles.each(function () {
    if ($(this).val().indexOf('provisional') > -1) {
      $('.page-button_user_remove_provisional').removeClass('hidden');
    }
  });
});
