// Constants
const apiURL = 'https://better-weeklyd3-server.weeklyd3.repl.co';
// Load account info
function startLogout() {
    document.getElementById('loggedin').hidden = 'hidden';
    document.getElementById('logout').hidden = '';
    fetch(`${apiURL}/logout.php`, {"method": "POST", credentials: 'include'})
    .then(function() {
        refreshLogin();
    });
}
function refreshLogin() {
    document.getElementById('newarticle').hidden = 'hidden';
document.getElementById('notloggedin').hidden = 'hidden';
        document.getElementById('loggedin').hidden = 'hidden';
        document.getElementById('loginStatusError').hidden = 'hidden';
    document.getElementById('logout').hidden = 'hidden';
    document.getElementById('login').hidden = '';
    fetch(`${apiURL}/assertLogin.php`, {
        credentials: 'include'
    })
    .then(function(res) {
        return res.json();
    })
    .then(function(j) {
            document.getElementById('login').hidden = 'hidden';

        if (j) {
            document.getElementById('active-name').textContent = j;
            document.getElementById('newarticle').hidden = '';
            document.getElementById('loggedin').hidden = '';
        } else {
            document.getElementById('notloggedin').hidden = '';
        }
    }, function() {
        document.getElementById('login').hidden = 'hidden';
        document.getElementById('loginStatusError').hidden = '';
    });
}
const accountWindowWidth = 200;
const accountWindowHeight = 750;
function startLogin() {
    window.open('login.html', 'Log in', `width=${accountWindowWidth},height=${accountWindowHeight},location=yes`);
}
function startSignup() {
    window.open('signup.html', 'New account', `width=${accountWindowWidth},height=${accountWindowHeight},location=yes`);
}
window.addEventListener('DOMContentLoaded', refreshLogin);
function initEditor() {
    fetch('editor.html')
    .then(function(res) {
        return res.text();
    }, function() {
        document.getElementById('editor').textContent = 'Sorry. Something went awry. This network is STOOBID';
        throw new Exception('Network faliure');
    })
    .then(function(text) {
        document.getElementById('editor').innerHTML = text;
    });
}