var editor = new MediumEditor('.editable', {
    buttonLabels: 'fontawesome'
});

//checks if user is logged in and loads their presaved text if true
function test(){
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            //updates the text to what is stored on database
            updateText();

        } else {
            const loginWithDiffButton = document.getElementById("loginWithDiffButton");
            const logoutButton = document.getElementById("logoutButton");
            logoutButton.style.display = "none";
            loginWithDiffButton.style.display = "none";
            editor.setContent("Login to save your work automatically.")
        }
    })

}

function googleLogin(){

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider)
        .then(function(result) {

            var user = firebase.auth().currentUser;

            var display = document.getElementById("display")

            display.innerHTML = user.displayName;
            
            //updates the text to what is stored on database
            updateText();

        }).catch(function(error){
            console.log("Google Login Failed!")
            window.alert("Google Login Failed!")
        })

}

//updates the text to what is stored on database
function updateText(){

    var user = firebase.auth().currentUser;

    const input = document.getElementById("input");

    const loginButton = document.getElementById("loginButton");

    const db = firebase.firestore();

    if(user == null) window.alert("USER == NULL")

    //hide login button
    loginButton.style.display = "none";

    //this is where data is stored
    const text = db.collection('Text').doc(user.uid);
    
    //make sure database only updates once
    var hasUpdated = false;

    //set text to value stored in database
    text.onSnapshot(doc => {
        
        const data = doc.data();
        if(!hasUpdated) {
            editor.setContent(data.text);
            hasUpdated = true;
        }
    })

}

function logout() {

    const input = document.getElementById("input");

    const loginButton = document.getElementById("loginButton");

    const logoutButton = document.getElementById("logoutButton");

    const loginWithDiffButton = document.getElementById("loginWithDiffButton");

    //reset text to default
    firebase.auth().signOut()
        .then(function(result){
            editor.setContent("Login to save your work");
        })

    loginButton.style.display = "block";

    logoutButton.style.display = "none";

    loginWithDiffButton.style.display = "none";

}

function loginWithDiff(){
    window.alert("Please make sure you are logged out of chrome or else this will automatically log you in again.")
    logout();
    googleLogin();
}

//update the database when the text is changed
editor.subscribe('editableInput', function (onchange, editable) {
    
    const input = editor.getContent();
    var user = firebase.auth().currentUser;
    const db = firebase.firestore();
    const storage = db.collection('Text').doc(user.uid);
    storage.set({text: input})


});

