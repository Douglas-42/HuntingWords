let wordsToHide = [];
let amountOfLetters = 15;
let lettersTable = [];
let tableDiv = document.getElementsByClassName("table")[0];
let wordsDiv = document.getElementsByClassName("wordsToSearch")[0];
let wordsToHideTextArea = document.getElementsByClassName("words")[0];
let setUpModal = document.getElementsByClassName("setUpHW")[0];
function GetWordsToHide(){
    let arr = wordsToHideTextArea.value.split(",");
    arr = arr.map(w => {
        return w.trim();
    });
    return arr;
}
function ShowSetUpScreen(){
    setUpModal.classList.remove("hide");
} 
function GenerateHW(){
    tableDiv.innerHTML = "";
    wordsDiv.innerHTML = "";
    wordsToHide = GetWordsToHide();
    if(wordsToHide.length < 2){
        alert("Not enough words");
        return;
    }
    lettersTable = GenerateTable(wordsToHide,amountOfLetters)
    wordsToHide.forEach(_word => {
        let p = document.createElement("p");
        p.innerHTML = `${_word}`;
        wordsDiv.appendChild(p);
    });
    for(let line=0; line < amountOfLetters; line++){
        let lineDiv = document.createElement("div");
        let lineBreakElement = document.createElement("br");
        for (let column = 0; column < amountOfLetters; column++) {
            let p = document.createElement("p");
            p.innerHTML = `${lettersTable[line][column]}`
            lineDiv.appendChild(p);
        }
        tableDiv.appendChild(lineDiv);
        tableDiv.appendChild(lineBreakElement);
    }
    setUpModal.classList.add("hide");
}
function GenerateTable(_words, _amountOfLetters){
    // Initialize Table
    let _table = [];
    let _takenSpots = [];
    for(let y=0; y < _amountOfLetters; y++){
        let _line = [];
        for (let x = 0; x < amountOfLetters; x++) {
            _line[x] = String.fromCharCode(getRandomInt(65,91));
        }
        _table[y] = _line;
    }
    // Hiding Words
    _words.forEach(_word => {
        let wordHasNotBeenCompletedWrittenOnTable = true;
        while(wordHasNotBeenCompletedWrittenOnTable){
            let _res = PutWordInRow(_word,_amountOfLetters,_table,_takenSpots);
            if(typeof _res == "object") {
                _table = _res[0];
                _takenSpots = _res[1];
                wordHasNotBeenCompletedWrittenOnTable = false;
                break;
            }
            _res = PutWordInColumn(_word,_amountOfLetters,_table,_takenSpots);
            if(typeof _res == "object") {
                _table = _res[0];
                _takenSpots = _res[1];
                wordHasNotBeenCompletedWrittenOnTable = false;
                break;
            }
            let _reverseWord = reverseString(_word);
            _res = PutWordInRow(_reverseWord,_amountOfLetters,_table,_takenSpots);
            if(typeof _res == "object") {
                _table = _res[0];
                _takenSpots = _res[1];
                wordHasNotBeenCompletedWrittenOnTable = false;
                break;
            }
            _res = PutWordInColumn(_reverseWord,_amountOfLetters,_table,_takenSpots);
            if(typeof _res == "object") {
                _table = _res[0];
                _takenSpots = _res[1];
                wordHasNotBeenCompletedWrittenOnTable = false;
                break;
            }
        }
    }
    );
    return _table;
}
function PutWordInRow(_word,_amountOfLetters, _table, _takenSpots){
    let startSpot = [getRandomInt(0,_amountOfLetters-_word.length),getRandomInt(0,_amountOfLetters)];
    for(let i=startSpot[0]; i<_word.length+startSpot[0];i++){
        if(_takenSpots.includes([i,startSpot[1]].join()) && _word[i-startSpot[0]] != _table[i][startSpot[1]]){
            return false;
        }else{
            _table[i][startSpot[1]] = _word[i-startSpot[0]].toUpperCase();
            _takenSpots.push([i,startSpot[1]].join());
        }
    }
    return [_table,_takenSpots];
}
function PutWordInColumn(_word,_amountOfLetters, _table, _takenSpots){
    let startSpot = [getRandomInt(0,_amountOfLetters),getRandomInt(0,_amountOfLetters-_word.length)];
    for(let i=startSpot[1]; i<_word.length+startSpot[1];i++){
        if(_takenSpots.includes([startSpot[0],i].join()) && _word[i-startSpot[1]] != _table[startSpot[0]][i]){
            return false;
        }else{
            _table[startSpot[0]][i] = _word[i-startSpot[1]].toUpperCase();
            _takenSpots.push([startSpot[0],i].join());
        }
    }
    return [_table,_takenSpots];
}