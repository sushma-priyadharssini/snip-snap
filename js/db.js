// enable offline data
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multiple tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
});

db.collection('snaps').onSnapshot(snapshot => {
	//console.log(snapshot.docChanges());
	snapshot.docChanges().forEach(change => {
	  //console.log(change.type, change.doc.id, change.doc.data());
	  if(change.type === 'added' && change.doc.data().imgUrl != ''){
		renderSnaps(change.doc.data(), change.doc.id);
	  }
	  if(change.type === 'removed'){
		removeSnap(change.doc.id);
	  }
	});
});

var imgUrl = '';

const uploadButton = document.querySelector('#upload-image');
uploadButton.onclick = () => {
const ref = firebase.storage().ref();
const file = document.querySelector("#open-file-explorer-input").files[0];
const name = +new Date() + "-" + file.name;
const metadata = {
	contentType: file.type
};
const task = ref.child(name).put(file, metadata);
task.then(snapshot => snapshot.ref.getDownloadURL())
	.then(url => {
	console.log(url);
	imgUrl = url;
	document.getElementById("add-btn").disabled = false;
	})
	.catch(console.error);
};

// add new snap
const form = document.querySelector('#add-btn');
form.addEventListener('click', evt => {
  evt.preventDefault();
  
  const snap = {
	title: form.title.value,
	desc: form.description.value,
	imgUrl: imgUrl
  };

  db.collection('snaps').add(snap)
    .catch(err => console.log(err));

  form.title.value = '';
  form.description.value = '';
});

// remove a snap
const snapContainer = document.querySelector('.snaps');
snapContainer.addEventListener('click', evt => {
  if(evt.target.tagName === 'I'){
	// console.log('deleting')
    const id = evt.target.getAttribute('data-id');
    db.collection('snaps').doc(id).delete();
  }
})

