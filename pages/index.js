import React from 'react';
import { If, Then, Else } from 'react-if';
import { Pagination } from 'react-bootstrap';
import Link from 'next/link';

import axios from 'axios';
import _ from 'lodash';

import Layout from '../components/layout';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      empty: false,
      query: '',
      order: 'name',
      employees: this.props.employees
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.queryEmployees = this.queryEmployees.bind(this);
    this.getEmployeeThumbnail = this.getEmployeeThumbnail.bind(this);
    this.renderResultsList = this.renderResultsList.bind(this);
  }
  static async getInitialProps() {
    const res = await axios.get('http://localhost:3000/api/employees')
    return { employees: res.data.employees }
  }
  handleChange(event) {
    let obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    if (event.target.name == 'order') this.queryEmployees()
  }
  handleSubmit(event) {
    event.stopPropagation();
    event.preventDefault();
    this.queryEmployees();
  }
  queryEmployees() {
    this.setState({loading: true}, () => {
      axios.get('/api/employees', {
        params: {
          name: this.state.query,
          order: this.state.order
        }
      })
      .then((response) => {
        const { employees } = response.data;
        this.setState({
          employees: employees,
          loading: false
        });
      })
      .catch((error) => {
        this.setState({loading: false});
      });
    });
  }
  getEmployeeThumbnail(employee) {
    if (!_.has(employee, 'images')) {
      return 'http://placehold.it/64x64';
    }
    return _.get(_.last(employee.images), 'url', 'http://placehold.it/64x64');
  }
  renderResultsList() {
    const { loading, empty, query, employees, limit, page, total } = this.state;
    
    if (loading || empty) {
      let alert;
      if (loading) {
        alert = (<div className='alert alert-info'>Loading...</div>);
      } else if (empty) {
        alert = (<div className='alert alert-warning'>Nenhum resultado encontrado<mark>{ query }</mark>.</div>);
      }
      return (
        <div className='container'>
          { alert }
        </div>
      );
    }
    let pagination = '';
    const list = _.map(employees, (employee) => {
      return (
        <div className='media' key={employee.id}>
          <div className='media-left'>
            <Link href={'/employees?id=' + employee.id} as={'/employees/' + employee.id}>
              <a><img className='media-object' src={this.getEmployeeThumbnail(employee)} width="64" alt='*' /></a>
            </Link>
          </div>
          <div className='media-body'>
            <h4 className='media-heading'>
              <Link href={'/employees?id=' + employee.id} as={'/employees/' + employee.id}><a>{employee.name}</a></Link>
            </h4>
            <p>
              {employee.job} <br/>
              Salary: {employee.salary}
            </p>
          </div>
        </div>
      );
    });

   
    return (
      <div>
        { list }
        <Link href={'/employees?id=new'} as={'/employees/new'}><a className="btn btn-primary">Novo Cliente
        </a></Link>
      </div>
    );
  }
  render() {
    return (
      <Layout title='Awesome Employees'>
        <div className='container'>
          <div className='page-header'>
            <h1>Clientes</h1>
          </div>
          <div className='panel panel-default'>
            <div className='panel-heading'>Procurar por cliente</div>
            <div className='panel-body'>
              <form onSubmit={this.handleSubmit} className='form-inline'>
                <div className='form-group'>
                  <input
                    type='search'
                    name='query'
                    value={this.state.query}
                    onChange={this.handleChange}
                    className='form-control'
                    placeholder='Name' />
                </div>
                <button type='submit' className='btn btn-primary'>Pesquisar</button>
              </form>
            </div>
          </div>
        </div>
        <div className='container'>
          <select className="form-control sort-order" name="order" onChange={this.handleChange}>
            <option value="name_asc">Name (Ascending)</option>
            <option value="name_desc">Name (Descending)</option>
            <option value="salary_asc">Salary (Ascending)</option>
            <option value="salary_desc">Salary (Descending)</option>
          </select>
          { this.renderResultsList() }
        </div>
      </Layout>
    );
  }
}

export default SearchPage;
