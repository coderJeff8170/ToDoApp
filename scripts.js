/* REQUIREMENTS
    * Input field for task title - X
    * TUWBAT enter text into the field and click the Add Task button
        * Need an Add Task button - X 
        * Need click handler for Add Task button - X
	    * Add Task button should be disabled if nothing is typed into the input field to avoid empty tasks - X
	* Code should keep a list of all tasks added to list
	* List should persist (use local storage)
    * TUWBAT delete a Task - X
    * TUWBAT complete a Task by clicking a checkbox - X
    * The app should display an empty message when no Tasks have been added - X
    * The empty message should disappear when at least one Task has been added - X
    * The app should display a message in place of the empty message (if Tasks have been added)
        that tells the user how many Tasks there are
*/

// Setup global variables
const addButton = document.querySelector("#addTaskBtn");
const titleField = document.querySelector("#title");
const emptyMessage = document.querySelector("#empty-message");
const taskTemplate = document.querySelector("#task-template");
const tasksElement = document.querySelector("#all-tasks");

let taskNumber = 0;

let newTasks=[];
let oldTasks=[];

//Task class
class Task {

    constructor(title) {
        this.taskNumber = taskNumber;
        this.isCompleted = false;
        this.title = title;
        this.displayTask();
        this.elementReference;
        this.id = null;
    }

    // add a task to the DOM
    displayTask() {
        this.elementReference = taskTemplate.cloneNode(true);
        let taskTitleElement = this.elementReference.querySelector(".task-title");

        // if tTE is not an array, set inner text of task to user input
        if (!Array.isArray(taskTitleElement)) {
            taskTitleElement.innerText = this.title;
        }

        // Remove the hide class from the clone
        this.elementReference.classList.remove("hide");
        tasksElement.appendChild(this.elementReference);

        // bind methods to class instance
        let completionCheckbox = this.elementReference.querySelector(".completion-box");
        completionCheckbox.onclick = this.onComplete.bind(this);
        
        let removeButton = this.elementReference.querySelector(".remove-task");
        removeButton.onclick = this.onDelete.bind(this);
        
        taskNumber++;
    }

    onComplete() {
        let completionCheckbox = this.elementReference.querySelector(".completion-box");
        // TODO: allow this to be toggled?
        this.isCompleted = true;
        this.elementReference.classList.add("completed");
        completionCheckbox.checked = true;
        completionCheckbox.disabled = true;
        //update local storage to record onComplete state
        localStorage.setItem("storedTasks", JSON.stringify(newTasks));
    }

    onDelete() {
        //confirm 
        let answer = confirm("are you sure you want to delete this task?");
        if(answer==true) {
            // remove it from the newTasks array
            newTasks.splice(newTasks.findIndex(item => item.name === this.name), 1)
            // update localStorage
            localStorage.setItem("storedTasks", JSON.stringify(newTasks));
            // add empty message if last message deleted
            if(newTasks.length===0){
                emptyMessage.classList.remove("hide");
            }
            // remove task from DOM
            this.elementReference.remove();
        }else{
            return;
        }  
    }
}

//first, check local storage...
    if(localStorage.getItem("storedTasks")===null||localStorage.getItem("storedTasks")=="[]"){
        oldTasks = [];
    }else{
//... and persist any old tasks from local storage
        oldTasks = JSON.parse(localStorage.getItem("storedTasks"));
        //since methods disappear on locally stored objects, create new Tasks from them so that they display.
        oldTasks.map(task=>recreateTasks(task.title, task.isCompleted));
        emptyMessage.classList.add("hide");
    }
    
    
    

// Setup default state
setButtonDisabled(true);

/* Event Handlers */

function onAddTask() {
    // Store data entered by user in a new Task object
    let newTask = new Task(titleField.value);
    // Store the newly created Task object in the newTasks array
    newTasks.push(newTask);
    // Store the updated array in localStorage
    localStorage.setItem("storedTasks", JSON.stringify(newTasks));
    // Hide #empty-message element
    emptyMessage.classList.add("hide");
    // Clear titleField
    titleField.value = null;
    setButtonDisabled(true);
}


// recreate tasks from local storage
function recreateTasks(title, isCompleted) {
//make a new task with the title
let newTask = new Task(title);
//if the task was complete in LS, set new task to complete
if(isCompleted){
    newTask.onComplete();
}
// Store the newly created Task object in the newTasks array
newTasks.push(newTask);
// and reset local storage 'storedTasks'
localStorage.setItem("storedTasks", JSON.stringify(newTasks));
}

// onkeypress handler
function onType() {
    if (!titleField.value) {
        setButtonDisabled(true);
    } else {
        setButtonDisabled(false);
    }
}

// Encapsulation
function setButtonDisabled(isDisabled) {
    addButton.disabled = isDisabled;
}

/* end of Event Handlers */