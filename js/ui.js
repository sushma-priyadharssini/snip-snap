const snaps = document.querySelector('.snaps');

document.addEventListener('DOMContentLoaded', function() {
	// nav menu
	const menus = document.querySelectorAll('.side-menu');
	M.Sidenav.init(menus, {edge: 'left'});
	// add snap form
	const forms = document.querySelectorAll('.side-form');
	M.Sidenav.init(forms, {edge: 'right'});
});

// render snaps data
const renderSnaps = (data, id) => {
	const html = `
	  <div class="card-panel snap white row" data-id="${id}">
		<img src="/img/Bird.jpg" alt="snap thumb">
		<div class="snap-details">
		  <div class="snap-title">${data.title}</div>
		</div>
		<div class="snap-actions">
		  <i class="material-icons" data-id="${id}">edit</i>
		  <i class="material-icons" data-id="${id}">delete_outline</i>
		</div>
	  </div>
	`;
	snaps.innerHTML += html;
};