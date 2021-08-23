chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        name: "PBNJ"
    });
});

chrome.storage.local.get("name", data => {

});

const getTab = () =>
new Promise(resolve => {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        tabs => resolve(tabs[0])
    );
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // console.log(tabId);
    // console.log(changeInfo);
    // console.log(tab);
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {


        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["./foreground_styles.css"]

        }).then(() => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["./foreground.js"]

            })
                .then(() => {
                    console.log("injected foreground script");

                    chrome.tabs.sendMessage(tabId, {
                        message: 'change_name',
                        payload: 'USER'
                    })

                })
        })

            .catch(err => console.log(err));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.message === 'get_name') {
    chrome.storage.local.get('name', data => {
        if (chrome.runtime.lastError) {
            sendResponse({
                message: 'fail'
            });
            return;
        }
        sendResponse({
            message: 'success',
            payload: data.name
        });

    });
    return true;
} else if (request.message === 'change_name'){
    chrome.storage.local.set({
        name: request.payload
    }, () => {
        if (chrome.runtime.lastError) {
            sendResponse({
                message:'fail'
            });
            return;
        }
        sendResponse({message: 'success'});
    })
    return true
    }

//     })
// }


});
// chrome.runtime.sendMessage() > 
// chrome.tabs.sendMessage > sends message to foreground.js
console.log("background script running");