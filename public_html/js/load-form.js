document.addEventListener("DOMContentLoaded", () => {
  fetch('/submissions.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('submission-container');
      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No submissions found.</p>';
        return;
      }
      data.forEach(row => {
        const card = document.createElement('div');
        card.className = 'card shadow-sm mb-4 position-relative';

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 m-2';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Delete this submission';

        deleteBtn.addEventListener('click', () => {
          if (!confirm('Are you sure you want to delete this submission?')) return;

          fetch('/delete-submission', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${encodeURIComponent(row.id)}`
          })
            .then(res => res.ok ? res.text() : Promise.reject("Failed to delete"))
            .then(() => {
              card.remove();
            })
            .catch(err => {
              console.error(err);
              alert('Failed to delete submission.');
            });
        });

        // Card content
        card.innerHTML = `
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-2"><strong>Date:</strong> ${row.submitted_at || ''}</div>
              <div class="col-md-6 mb-2"><strong>First Name:</strong> ${row.first || ''}</div>
              <div class="col-md-6 mb-2"><strong>Last Name:</strong> ${row.last || ''}</div>
              <div class="col-md-6 mb-2"><strong>Email:</strong> ${row.email || ''}</div>
              <div class="col-md-6 mb-2"><strong>Phone:</strong> ${row.phone || ''}</div>
              <div class="col-md-6 mb-2"><strong>DOB:</strong> ${row.dob || ''}</div>
              <div class="col-md-6 mb-2"><strong>State:</strong> ${row.state || ''}</div>
              <div class="col-md-6 mb-2"><strong>Suburb:</strong> ${row.suburb || ''}</div>
              <div class="col-md-6 mb-2"><strong>Street:</strong> ${row.street || ''}</div>
              <div class="col-md-6 mb-2"><strong>House:</strong> ${row.house || ''}</div>
              <div class="col-12 mt-3">
                <strong>Message:</strong>
                <div class="border rounded p-2 mt-1 bg-light">${row.message || ''}</div>
              </div>
            </div>
          </div>
        `;

        // Append delete button
        card.appendChild(deleteBtn);
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById('submission-container').innerHTML =
        '<p class="text-danger text-center">Failed to load submissions.</p>';
    });
});
