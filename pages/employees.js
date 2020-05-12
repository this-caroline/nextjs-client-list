import React from 'react'
import { If, Then, Else } from 'react-if'
import Link from 'next/link'
import Router from 'next/router'

import axios from 'axios'
import _ from 'lodash'

import Layout from '../components/layout'

class EmployeePage extends React.Component {
  static async getInitialProps ({ query: { id } }) {
    if (id == 'new') {
      return { id }
    }
    const res = await axios.get('http://localhost:3000/api/employees/' + id)
    const props = res.data.employee
    props.id = id
    return props
  }
  constructor(props) {
    super(props)
    this.state = this.props
    this.saveChanges = this.saveChanges.bind(this)
    this.putEmployee = this.putEmployee.bind(this)
    this.postEmployee = this.postEmployee.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deleteEmployee = this.deleteEmployee.bind(this)
  }
  
  handleChange(event) {
    let obj = {}
    obj[event.target.name] = event.target.value
    this.setState(obj)
  }

  putEmployee() {
    axios.put('/api/employees/' + this.props.id, this.state)
    .then((response) => {
      Router.push('/')
    })
    .catch((error) => {
      this.setState({loading: false})
    })
  }
   
  deleteEmployee() {
    if (!window.confirm('Are you sure?')) return
    axios.delete('/api/employees/' + this.props.id)
    .then((response) => {
      Router.replace('/')
    })
    .catch((error) => {
      this.setState({loading: false})
    })
  }

  postEmployee() {
    axios.post('/api/employees/', this.state)
    .then((response) => {
      Router.push('/')
    })
    .catch((error) => {
      this.setState({loading: false})
    })
  }

  saveChanges(event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({loading: true}, () => {
      if (this.props.id == 'new') {
        this.postEmployee()
      }
      else {
        this.putEmployee()
      }
    })
    
  }
 
  render() {
    let h4 = null
    let deleteButton = null
    if (this.props.id == 'new') {
      h4 = <h4>Novo Cliente</h4>
    }
    else {
      deleteButton = <button onClick={this.deleteEmployee} className='btn btn-primary btn-danger'>Deletar</button>
      h4 = <h4>Editar { this.state.name }</h4>
    }
    return (
      <Layout title={ 'Clients' }>
        <div className='container'>
          { h4 }
          <form onSubmit={this.saveChanges}>
            <div className='form-group row'>
              <label htmlFor="Nome" className="col-sm-2 col-form-label">Nome</label>
              <div className="col-sm-10">
                <input name='name'    value={this.state.name} onChange={this.handleChange} className='form-control' placeholder='Name' />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor="Emprego" className="col-sm-2 col-form-label">Emprego</label>
              <div className="col-sm-10">
                <input name='job'     value={this.state.job} onChange={this.handleChange} className='form-control' placeholder='Job' />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor="Salário" className="col-sm-2 col-form-label">Salário</label>
              <div className="col-sm-10">
                <input name='salary'  value={this.state.salary} onChange={this.handleChange} className='form-control' placeholder='Salary' />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor="Endereço" className="col-sm-2 col-form-label">Endereço</label>
              <div className="col-sm-10">
                <input name='address' value={this.state.address} onChange={this.handleChange} className='form-control' placeholder='address' />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor="Telefone" className="col-sm-2 col-form-label">Telefone</label>
              <div className="col-sm-10">
                <input name='phone'   value={this.state.phone} onChange={this.handleChange} className='form-control' placeholder='phone' />
              </div>
            </div>
          <button type='submit' className='btn btn-primary'>Salvar</button>
          </form>
          { deleteButton }
        </div>
      </Layout>
    )
  }
}

export default EmployeePage
