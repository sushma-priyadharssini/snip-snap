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
	  if(change.type === 'added'){
		renderSnaps(change.doc.data(), change.doc.id);
	  }
	  if(change.type === 'removed'){
		// remove the document data from the web page
	  }
	});
});