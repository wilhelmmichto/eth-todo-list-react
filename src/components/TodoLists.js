import React, { Component } from 'react'

class TodoList extends Component {

  render() {
    return (
      <div id="content"  >
        <form onSubmit={(event) => {
          event.preventDefault()
          this.props.createTask(this.task.value)
        }} style={{display:'flex', marginLeft:'50px'}}>
          <input
            id="newTask"
            ref={(input) => {
              this.task = input
            }}
            type="text"
            className="form-control"
            placeholder="Add task..."
            required 
            style={{marginTop:'20px' , marginLeft:'20px'  }}/>
          <input type="submit" hidden={false} value='+' style={{marginTop:'20px',paddingLeft:'10px',paddingRight:'10px'}} />
        </form>
        <ul  id="taskList" className="list-unstyled">
          { this.props.tasks.map((task, key) => {
            return(
              <div className="taskTemplate checkbox" key={key}>
                <label style={{marginLeft:'50px'}}>
                  <input 
                  type="checkbox"
                  name= {task.id}
                  defaultChecked={task.completed}
                  ref={(input) => {
                    this.checkbox = input
                  }}
                  onClick={(event) => {
                    this.props.toggleCompleted(this.checkbox.name) }}/>
                  <span className="content" style={{marginLeft:'10px'}}>  {task.content}</span>
                </label>
              </div>
            )
          })}
        </ul>
        <ul id="completedTaskList" className="list-unstyled">
        </ul>
      </div>
    );
  }
}

export default TodoList;