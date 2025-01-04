import Swal from 'sweetalert2';

const swalWithTailwindButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});

const showDeleteConfirmation = (): Promise<boolean> => {
  return swalWithTailwindButtons.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      return false;
    }
    return false;
  });
};

const showAutoCloseAlert = (title: string = "success"): void => {
  let timerInterval;
  Swal.fire({
    title: title,
    timer: 300,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        if (timer) {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
    }
  });
};

const showSuccessDialog = (message: string) => {
  Swal.fire({
    title: 'Success',
    text: message,
    icon: 'success',
    timer: 2000, 
    showConfirmButton: false,
    customClass: {
      popup: 'swal2-front'
    }
  });
};

const showErrorDialog = (message: string) => {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error',
    timer: 2000, 
    showConfirmButton: false,
    customClass: {
      popup: 'swal2-front'
    }
  });
};

export { showDeleteConfirmation, showSuccessDialog, showErrorDialog, showAutoCloseAlert };