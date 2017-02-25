import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      user: null,
      repos: null,
      filteredRepos: null
    };
  }

  handleUserChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleUserSubmit(e) {
    e.preventDefault();
    const repoUrl = `https://api.github.com/users/${this.state.username}/repos`;
    const userUrl = `https://api.github.com/users/${this.state.username}`;

    fetch(userUrl)
      .then(blob => blob.json())
      .then(userInfo => {
        console.log(userInfo);
        this.setState({
          user: userInfo
        });
      });

    fetch(repoUrl)
      .then(blob => blob.json())
      .then(repos => {
        console.log(repos);
        this.setState({
          repos: [...repos],
          filteredRepos: [...repos]
        });
      });

  }

  handleRepoChange(e) {
    const filteredArray = this.state.repos.filter(repo => repo.name.toLowerCase().includes(e.target.value));
    this.setState({
      filteredRepos: filteredArray
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleUserSubmit.bind(this)}>
          <input type='search' onChange={this.handleUserChange.bind(this)} className='search-bar' id='user-search' placeholder='Search for a GitHub user' />
          <input type='submit' />
        </form>

        <div>

          {this.state.user && 
            <div className='user-banner'>
              <h1>{this.state.user.name}</h1>
              <img className='avatar-img' src={this.state.user.avatar_url} />
            </div>
          }

          {this.state.repos &&
            <div>
              <h3>Repositories</h3>
              <form>
                <input type='search' onChange={this.handleRepoChange.bind(this)} placeholder='filter by repo name' className='search-bar' id='repo-search' />
              </form>
              {this.state.filteredRepos.map((repo, index) => (
                <Repo key={index} details={repo} />
              ))}
            </div>
          }

        </div>
      </div>
    );
  }
}

class Repo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.details.name} <a href={this.props.details.url}>Link</a>
      </div>
    );
  }
}