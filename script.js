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
function preview(button) {
    const originalText = button.value;
    button.disabled = 'disabled';
    button.value = 'Previewing...';
    const p = new FormData();
    p.set('text', document.getElementById('contents').value);
    fetch(`${apiURL}/parse.php`, {body: p, method: 'POST'})
    .then(function(res) {
        return res.json();
    })
    .then(function(text) {
        button.disabled = '';
        button.value = originalText;
        document.getElementById('preview-area').innerHTML = text;
    });
}
function postArticle() {
    const data = new FormData(document.querySelector('form'));
    document.getElementById('poststatus').textContent = 'Posting article - querying server';
    fetch(`${apiURL}/newArticle.php`, {
        body: data,
        "method": "POST",
        "credentials": "include"
    })
    .then(function(res) {
        document.getElementById('poststatus').textContent += "\n" + 'Receiving data';
        return res.json();
    })
    .then(function(json) {
        if (json.status) {
            document.getElementById('newarticle').hidden = '';
            document.getElementById('editor').hidden = 'hidden';
            loadArticle(json.data.articleId);
            document.getElementById('poststatus').textContent += "\n" + 'Posting complete';
        } else {
            document.getElementById('poststatus').innerHTML += "\n" + '<span style="color:red;">There seems to be a problem with your network. Maybe you are not logged in?' + "\n" + 'Please log out and log back in, and check your internet connection. Your post has not been submitted.</span>';
        }
    }, function() {
        document.getElementById('poststatus').innerHTML += "\n" + '<span style="color:red;">There seems to be a problem with your network. Maybe you are not logged in?' + "\n" + 'Please log out and log back in, and check your internet connection. Your post has not been submitted.</span>';
    })
}
function loadArticle(id, changeURL = true) {
    document.getElementById('article-viewer').hidden = 'hidden';
    document.getElementById('article-not-found').hidden = 'hidden';
    document.getElementById('homescreen').hidden = 'hidden';
    document.getElementById('article-loading').hidden = '';
    var url = new URL(location.href);
    url.searchParams.set("article", id);
    if (changeURL) history.pushState({}, '', url);
    document.title = 'Loading article...';
    fetch(`${apiURL}/findArticle.php?article=${encodeURIComponent(id)}`)
    .then(function(res) {
        return res.json();
    })
    .then(function(json) {
        document.getElementById('article-loading').hidden = 'hidden';
        if (json === false) {
            document.getElementById('article-not-found').hidden = '';
            return;
        }
        document.getElementById('articletitle').textContent = json.title;
        document.getElementById('articleAuthor').textContent = json.creator;
        document.getElementById('creationTime').textContent = new Date(json.creationDate);
        document.title = json.title;
        document.getElementById('articleContents').innerHTML = json.html;
        document.getElementById('article-viewer').hidden = '';
    });
}
const pageURL = new URL(location.href);
if (pageURL.searchParams.get('article')) loadArticle(pageURL.searchParams.get('article'), false);
function getArticles(page, changeURL = true) {
    var url = new URL(location.href);
    url.searchParams.set('articlePage', page);
    if (changeURL) history.pushState({}, '', url);
    globalThis.page = page;
    document.getElementById('pagenum').textContent = page;
    if (page === 1) {
        document.getElementById('prev').disabled = 'disabled';
    } else document.getElementById('prev').disabled = '';
    document.getElementById('latest-articles').innerHTML = '';
    fetch(`${apiURL}/articleList.php?limit=20&start=${(page - 1) * 20}`)
        .then(function(js) {
            return js.json();
        })
        .then(function(articles) {
            for (var i = 0; i < articles.length; i++) {
                const art = document.createElement('div');
                const title = document.createElement('h2');
                title.textContent = articles[i].data.title;
                art.appendChild(title);
                const blurb = document.createElement('div');
                blurb.textContent = articles[i].blurb;
                art.appendChild(blurb);
                const readMore = document.createElement('a');
                readMore.textContent = 'Read more...';
                pageURL.searchParams.set('article', articles[i].id);
                readMore.href = pageURL;
                art.appendChild(readMore);
                document.getElementById('latest-articles').appendChild(art);
            }
            document.getElementById('latest-articles-loading').hidden = 'hidden';
            document.getElementById('la-wrapper').hidden = '';
        });
}
getArticles(1, false);
if (pageURL.searchParams.get('page')) getArticles(pageURL.searchParams.get('page'), false);
