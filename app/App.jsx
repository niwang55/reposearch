import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      user: null,
      repos: null
    };
  }

  handleChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleSubmit(e) {
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
          repos: [...repos]
        });
      });

  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type='search' onChange={this.handleChange.bind(this)} className='search-bar' placeholder='Search for a username' />
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
              {this.state.repos.map((repo, index) => (
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