$('#confirmUserDeleteBtn').click((ev) => {
  sendRequest({ url: '/user/delete', method: 'DELETE' },
    (err, data) => {
      if (err) {
        return console.error(err);
      }
      window.location.href = '/?success-msg=Account successfully deleted.';
    },
  );
});
