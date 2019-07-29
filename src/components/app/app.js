import React, { Component } from 'react';
import './app.css'

import TodoList from '../todo-list'
import AppHeader from '../app-header'
import SearchPanel from '../search-panel'
import ItemStatusFilter from '../item-status-filter'
import ItemAddForm from '../item-add-form'


export default class App extends Component {
  maxId = 100;
  state = {
    todoData: [
      this.createTodoItem('Drink Cofee'),
      this.createTodoItem('Learn React'),
      this.createTodoItem('Build Awesome App')
    ],
    term: '',
    filter: 'all' // active, all, done
  }

  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  }
  deleteItem = (id) => {
    // this.setState(({ todoData }) => {
    //   const idx = todoData.findIndex((el) => {
    //     return el.id === id
    //   })
    //   //todoData.splice(idx, 1)

    //   const before = todoData.slice(0, idx)
    //   const after = todoData.slice(idx + 1)

    //   const newArray = [...before, ...after]

    //   return {
    //     todoData: newArray
    //   }
    // })

    this.setState(({todoData}) => ({ todoData: todoData.filter((item) => item.id !== id)}));
  }

  addItem = (text) => {
    // generate id
    const newItem = this.createTodoItem(text)
    // add element in array

    this.setState(({todoData}) => {
      const newArr = [
        ...todoData,
        newItem
      ]
      return {
        todoData: newArr
      }
    })
  }

  toggleProperty(arr, id, propName) {
    // 1. update object
    const idx = arr.findIndex((el) => {
      return el.id === id
    })

    const oldItem = arr[idx]
    const newItem = {...oldItem, [propName]: !oldItem[propName]}
    // 2. construct new array

    return [
      ...arr.slice(0, idx),
      newItem,
      ...arr.slice(idx + 1)
    ]
  }
  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    })
  }

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    })
  }

  onSearchChange = (term) => {
    this.setState({ term })
  }

  onFilterChange = (filter) => {
    this.setState({ filter })
  }

  search(items, term) {
    if (term.length === 0) {
      return items
    }
    return items.filter((item) => {
      return item.label
          .toLowerCase()
          .indexOf(term.toLowerCase()) > -1
    })
  }

  filter(items, filter) {
    switch(filter) {
      case 'all': 
        return items
      case 'active':
        return items.filter((item) => !item.done)
      case 'done':
        return items.filter((item) => item.done)
      default:
        return items
    }
  }

  render () {
    const { todoData, term, filter } = this.state

    const visibleItems = this.filter(this.search(todoData, term), filter)

    const doneCount = todoData
                        .filter((el) => el.done).length
    const todoCount = todoData.length - doneCount
    return (
      <div className="todo-app">
        <span>{ (new Date()).toLocaleDateString()}</span><br /><br />
        
        <AppHeader toDo={ todoCount } done={ doneCount }/>
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={this.onSearchChange} />
          <ItemStatusFilter 
            filter={filter}
            onFilterChange={this.onFilterChange}
          />
        </div>
        
        <TodoList 
          todos={ visibleItems }
          onDeleted={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
        />

        <ItemAddForm onItemAdded={this.addItem} />
      </div>
    )
  }
}