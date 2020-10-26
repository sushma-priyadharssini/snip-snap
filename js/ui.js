document.addEventListener('DOMContentLoaded', function() {
	// nav menu
	const menus = document.querySelectorAll('.side-menu');
	M.Sidenav.init(menus, {edge: 'left'});
	// add recipe form
	const forms = document.querySelectorAll('.side-form');
	M.Sidenav.init(forms, {edge: 'right'});

	// var elems = document.querySelectorAll('.fixed-action-btn');
	// var instances = M.FloatingActionButton.init(elems, {
    //   direction: 'right',
    //   hoverEnabled: false
    // });
});