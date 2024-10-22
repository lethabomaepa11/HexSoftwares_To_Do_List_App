const itemComponent = (id,isDone,text) => {return(`<div id="${id}" class="item flex justify-between">
                <div class="flex item-container">
                    <div class="btns flex">
                        <ion-icon class="delete" onclick="deleteItem('${id}')" name="trash-outline"></ion-icon>
                        <ion-icon name="create"></ion-icon>
                    </div>
                    <p>${text}</p>
                </div>
                ${isDone?`<ion-icon name="checkmark-done-circle" onclick="toggleIsDone('${id}')" class="done"></ion-icon>`:
                `<ion-icon name="checkmark-done-circle-outline" onclick="toggleIsDone('${id}')" class="notDone"></ion-icon>`
}    
            </div>`)};
const getKeys = (func) => {
    /**Receives a callback function and returns an array of available keys */
    //this function receives a callback function as an argument, if keys exist then they will passsed down to the callback function
    //all item keys are stored in keyStorage and are delimited by #
    const keyStorage = localStorage.getItem("keyStorage");
    if(keyStorage){
        const keys = keyStorage.split("#");
        func(keys,null);
    }else{
        const error = "No keys exist in the keyStorage!";
        func(null,error);
    }  
}
//render items
const getItems = () => {
    
    const itemsElement = document.getElementById("items");
    itemsElement.innerHTML = "";
    getKeys((keys,error) => {
        if(!error){
        for(let i = keys.length-1;i>=0;i--){
            
            getAndParseItem(keys[i],(item) => {
                itemsElement.innerHTML += itemComponent(keys[i],item.isDone,item.text);
            })
        }
    }else{
        console.error(error)
    }
})

}
const getAndParseItem = (key,func) => {
    const item = JSON.parse(localStorage.getItem(key));
    if(item){
        func(item,null);
    }
    else{
        const error = "Failed to parse item because it does not exist";
        func(null,error);
    }
}
getItems();
const insertItem = (event) => {
    const itemEL = document.getElementById("txtAdd");
    const item = {
        text: itemEL.value,
        isDone: false,
    };
    itemEL.value = "";
    //insert the generated id's into a separate localstorage 
    const keyStorage = localStorage.getItem("keyStorage");
    const itemKey = generateID();
    if(keyStorage){
        localStorage.setItem("keyStorage",keyStorage+"#"+itemKey);
    }else{
        localStorage.setItem("keyStorage",itemKey);
    }
    localStorage.setItem(itemKey,JSON.stringify(item));
    getItems();
    event.preventDefault();
}
const updateItem = (item) => {

}


const toggleIsDone = (id) => {
    getAndParseItem(id,(item)=>{
        if(item){
            localStorage.setItem(id,JSON.stringify({...item,isDone: !item.isDone}));
            getItems();
        }
    })
}


const deleteItem = (id) => {
    let confirmed = confirm("Confirm to delete item?")
    if(confirmed){
        localStorage.removeItem(id);
        //now delete the key from the keyStorage
        getKeys((keys,error) => {
            if(!error){
            const index = keys.indexOf(id);
            let text = "";
            let first, last = 0;
            first = index == 0 ? 1: 0;//if the item to be deleted is the first item
            last = index == keys.length-1 ? keys.length-2: keys.length-1;//if the item to be deleted is the last item
            text = first == 1 && first == keys.length?"":keys[first];
            for(var i = first+1; i <= last;i++){
                if(i != index){
                    text += "#"+keys[i];
                }
            }
            text===""?localStorage.removeItem("keyStorage"):localStorage.setItem("keyStorage",text);
        }
        else{
            console.warn(error);
        }});
        getItems();
        alert("Item Deleted successfully")
    }
    else{
        alert("Canceled");
    }
    
}


const generateID = () => {
    const alphas = ["a","b","c","d","e","f"];
    let id = "";
    for(let i = 0; i < 10; i++){
         let num = Math.floor(Math.random() * 9);
         if(num < alphas.length){
            num % 2 ? id += alphas[num].toUpperCase() : id += alphas[num];
         }
         else{
            id += num
         }
    }
    return id;
}