const dragstart_handler = ev => {
    console.log("dragstart");
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = "move";
}

const dragover_handler = ev => {
	console.log("dragOver");
	ev.preventDefault();
}

const drop_handler = ev => {
    console.log("drag")
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("text/plain");
    ev.target.innerText = document.getElementById(data).innerText;
    
    // once dropped, unempty the cell :)
    ev.target.classList.remove("empty")
    ev.target.setAttribute("ondrop", "");
    ev.target.setAttribute("ondragover", "");
    document.getElementById(data).innerText = "";

    // get new state after dropping
    state.content = getState(ul);
    // get new dimention from the state after dropping
    state.dimension = getDimension(state);
}
...

const dragend_handler = ev =>{
	console.log("dragEnd");
	ev.dataTransfer.clearData();
	setDroppable(document.querySelectorAll('li'));
  	setDraggable(document.querySelectorAll('li'))
}

let ul = document.querySelectorAll('li');
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", ""]


function setUp() {
    fillGrid(ul, letters);
    setId(ul)

    state.content = getState(ul);
    state.dimension = getDimension(state);

 // set up the droppable and dragabble contents
    setDroppable(ul) ;
    setDraggable(ul);
    console.log("The state dimension", state.dimension)
    
}

const state = {}
state.content = letters;


/**
 * Getters
 */
const getState = (items) => {
    const content = [];
    items.forEach((item, i) => {
        content.push(item.innerText)
    });
    return content;
}

const getEmptyCell = () => {
    const emptyCellNumber = state.emptyCellIndex+1;
    const emptyCellRow = Math.ceil(emptyCellNumber/3);
    const emptyCellCol = 3 - (3 * emptyCellRow - emptyCellNumber);
    // emptyCellRow holds the actual row number the empty tile falls into in a 9-cell grid
    // the array index will be one less than its value. Same goes for emptyCellCol
    return [emptyCellRow-1, emptyCellCol-1]
}

const getDimension = (state) => {
    let j = 0;
    let arr = [];
    const {content} = state;
    console.log()
    for(let i = 0; i < 3; i++) {
        arr.push(content.slice(j, j+3));
        j+=3;
    }

    return arr;
}

/**
 * setters
*/
const setDroppable = (items) => {
    items.forEach((item, i) => {
        if(!item.innerText) {
            state.emptyCellIndex = i;
            item.setAttribute("ondrop", "drop_handler(event);");
            item.setAttribute("ondragover", "dragover_handler(event);");
            item.setAttribute("class", "empty");
        }
        return;
    })
}

const setDraggable = (items) => {
    const [row, col] = getEmptyCell();

    let left, right, top, bottom = null;
    if(state.dimension[row][col-1]) left = state.dimension[row][col-1];
    if(state.dimension[row][col+1]) right = state.dimension[row][col+1];

    if(state.dimension[row-1] != undefined) top = state.dimension[row-1][col];
    if(state.dimension[row+1] != undefined) bottom = state.dimension[row+1][col];


    // make its right and left dragabble
    items.forEach(item => {
        if(item.innerText == top || 
            item.innerText == bottom || 
            item.innerText == right ||
            item.innerText == left) {
                item.setAttribute("draggable", "true");
                item.setAttribute("ondragstart", "dragstart_handler(event)");
                item.setAttribute("ondragend", "dragend_handler(event)")
            }
        
    })
}

const shuffle = (arr) =>{
	const copy = [...arr];
	for (i = 0; i < copy.length; i++) {
		let j = parseInt(Math.random()*copy.length);
		console.log(j);
		let temp = copy [i];
		copy[i] = copy [j];
		copy[j] = temp;
	}
	console.log(copy);
	return copy;
}


const fillGrid = (items, letters) => {
	let shuffled = shuffle(letters);
	console.log (shuffled);

	items.forEach((item, i) => {
		item.innerText = shuffled[i];
	})
}
const setId = (items) => {
	for (i = 0; i < items.lenght; i++) {
		items[i].setAttribute("id", 'li${i}')
	}
}


