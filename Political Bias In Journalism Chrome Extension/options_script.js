console.log("options script");

console.log("pop-up script");
chrome.runtime.sendMessage({
    message: "get_name"
}, response => {
    if (response.message === 'success'){
        document.querySelector('div').innerHTML = `Hello ${response.payload}`;
    }
});