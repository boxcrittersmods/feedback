//@ts-check
//example: https://github.com/boxcritters/bc-texture-pack-manager

$('[data-toggle="popover"]').popover(); 
$("#button-copy").prop('disabled', true);
function noRedirectForm(e) {
    e.preventDefault();
}

function getURLParams() {
	return window.location.search.replace('?','').split('&').reduce((obj,p)=>{
        obj[p.split('=')[0]] = p.split('=')[1];
        return obj;
    },{});
}

function getFormData(form) {
    return form.serializeArray().reduce((obj,item)=>{        
        obj[item.name] = item.value;
        return obj;
    },{})
}

function genFeedbackPage(giturl) {
    $("#button-copy").prop('disabled', true);
    var repourl = giturl.replace("https://github.com/","").replace("http://github.com/","").replace("github.com/","");

    if(repourl == giturl){
        return;
    }
    repourl = repourl.split("/");
    var user = repourl[0];
    var repo = repourl[1];
    var base = "/send?";
    var params = {};
    if(user!=="boxcritters") {
        params.user = user;
    }
    params.repo = repo;
    console.log(params);
    $("#button-copy").prop('disabled', false);
    
    var url = base + $.param(params);
    return url;

}



const USER = getURLParams().user || "boxcritters";
const REPO = getURLParams().repo;

function gitSubmit() {
    var form = $('#gitform');
    var feedbackurl = $('#feedback-url');
    var formdata = getFormData(form);
    if(!formdata.url) { 
        return;
    }
    var url = window.location.origin + genFeedbackPage(formdata.url);
    
    feedbackurl.val(url);
    //console.log(url);
   
    
    return false;
}

function redirectPost(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
}

function feedbackSubmit() {
    var form = $('#feedback-form');

    var data = getFormData(form);
    var api = "http://localhost:3000/feedback/";
    var url = api + REPO + "/";
    if(USER!=="boxcritters"){
        url += USER + "/";
    }
    //url += "?" + $.param(data);
    console.log(url);
    redirectPost(url,data);
    
}

$('#gitform').submit(noRedirectForm);
$('#feedback-form').submit(noRedirectForm);
$('#create-url').click(gitSubmit);
$('#send-feedback').click(feedbackSubmit);

new ClipboardJS('#button-copy');

if(window.location.pathname == "/send" && REPO == undefined){
    window.location.href = "/";
}

$('#staticEmail').val(`${USER}/${REPO}`);



