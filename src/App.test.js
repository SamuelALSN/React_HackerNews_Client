// import { render } from '@testing-library/react'
import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import App, { Search, Button, Table } from './App'
Enzyme.configure({ adapter: new Adapter() })

// test('renders learn react link', () => {
//   const { getByText } = render(<App />)
//   const linkElement = getByText(/learn react/i)
//   expect(linkElement).toBeInTheDocument()
// })

// this test verifies if App component will render without error
describe('App', () => {
  it('renders without crashing', () => {
    // this will test if our component is rendered to the view without any problem
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  test('has a valid snapshot', () => {
    /* the renderer.create() function creates a snapshot of my App component
     it renders it virtualy , and then will store the DOM into a snapshot
     after the snapshot is expected to match the previous version from the last snapshot
     this is made to make sure that the DoM have not change by accidents and stays the same
     */
    const component = renderer.create(
      <App />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Search', () => {
  /* The first test simply renders the Search component
    to the DOM and verifies that there is no error during
   the rendering process */
  it('renders seach without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Search>Search</Search>, div)
    ReactDOM.unmountComponentAtNode(div)
  })
  /* The second snapshot test is used to store a snapshot of the rendered component
    and to run it against a previous snapshot. It fails when the snapshot has changed. */
  test('has a valid snapshot', () => {
    const component = renderer.create(<Search>Search</Search>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Button', () => {
  it('renders Button without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Button>Give Me More</Button>, div)
    ReactDOM.unmountComponentAtNode(div)
  })
  test('has a valid snapshot', () => {
    const component = renderer.create(<Button>Give Me More</Button>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Table', () => {
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' }
    ]
  }
  it('renders Table without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Table {...props} />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  /* We are using shallow() to render the  component and assert that the Table
  was passed two items (a passé 2 éléments ). The assertion simply checks
  if the element has two elements with the class table-row.
  */
  it('shows two items in list ', () => {
    const element = shallow(
      <Table {...props} />
    )
    expect(element.find('.table-row').length).toBe(2)
  })
  test('has a valid snapshot', () => {
    const component = renderer.create(<Table {...props} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
