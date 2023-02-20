import React from 'react'
import Loader from 'react-loader-spinner'
import CardItem from '../CardItem'
import NavBar from '../NavBar'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Home extends React.Component {
  state = {
    projects: [],
    apiStatus: apiConstants.initial,
    categoryID: categoriesList[0].id,
  }

  componentDidMount() {
    this.fetchProjects()
  }

  fetchProjects = async () => {
    this.setState({apiStatus: apiConstants.inprogress})
    const {categoryID} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${categoryID}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const {projects} = data
      const updatedProjects = projects.map(item => ({
        id: item.id,
        imgUrl: item.image_url,
        name: item.name,
      }))
      this.setState({
        projects: updatedProjects,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failed})
    }
  }

  onChangeCategory = e => {
    this.setState({categoryID: e.target.value}, () => this.fetchProjects())
  }

  renderLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" width={60} height={60} color="#328af2" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.fetchProjects}>
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {projects} = this.state
    return (
      <ul className="projects-ul">
        {projects.map(item => (
          <CardItem key={item.id} item={item} />
        ))}
      </ul>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inprogress:
        return this.renderLoader()
      case apiConstants.failed:
        return this.renderFailureView()
      case apiConstants.success:
        return this.renderProjects()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home">
        <NavBar />
        <div className="container">
          <div className="options-container">
            <select className="select-option" onChange={this.onChangeCategory}>
              {categoriesList.map(item => (
                <option key={item.id} value={item.id}>
                  {item.displayText}
                </option>
              ))}
            </select>
          </div>
          {this.renderView()}
        </div>
      </div>
    )
  }
}

export default Home
