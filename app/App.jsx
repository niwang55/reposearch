import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      userInfo: null,
      userFollowers: null,
      repos: null,
      filteredRepos: null,
      secondUsername: '',
      secondUserFollowers: null,
      similarFollowers: null
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
          userInfo: userInfo
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

  handleSecondUserChange(e) {
    this.setState({
      secondUsername: e.target.value
    });
  }

  handleSecondUserSubmit(e) {
    e.preventDefault();

    const firstUserFollowerUrl = `https://api.github.com/users/${this.state.username}/followers`;
    const secondUserFollowerUrl = `https://api.github.com/users/${this.state.secondUsername}/followers`;

    fetch(firstUserFollowerUrl)
      .then(blob => blob.json())
      .then(userFollowers => {
        this.setState({
          userFollowers: userFollowers
        });
        return fetch(secondUserFollowerUrl);
      })
      .then(blob => blob.json())
      .then(secondUserFollowers => {
        this.setState({
          secondUserFollowers: secondUserFollowers
        });

        this.compareFollowers();
      });
  }

  compareFollowers() {
    let similarArray = [];

    this.state.userFollowers.forEach(userFollower => {
      this.state.secondUserFollowers.forEach(secondUserFollower => {
        if (userFollower.id === secondUserFollower.id) {
          similarArray.push(userFollower.login);
        }
      });
    });

    this.setState({
      similarFollowers: similarArray
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

          {this.state.userInfo && 
            <div className='user-banner'>
              <h1>{this.state.userInfo.name}</h1>
              <img className='avatar-img' src={this.state.userInfo.avatar_url} />
            </div>
          }

          {this.state.repos &&
            <div>

              <div>
                <h3>Repositories</h3>
                <form>
                  <input type='search' onChange={this.handleRepoChange.bind(this)} placeholder='filter by repo name' className='search-bar' id='repo-search' />
                </form>
                {this.state.filteredRepos.map((repo, index) => (
                  <Repo key={index} details={repo} />
                ))}
              </div>

              <div>
                <h3>Search another user to find common followers</h3>
                <form onSubmit={this.handleSecondUserSubmit.bind(this)}>
                  <input onChange={this.handleSecondUserChange.bind(this)} type='search' className='search-bar' placeholder='search another user' />
                  <input type='submit' />
                </form>

                {this.state.similarFollowers &&
                  <div>
                    <h4>Same Followers</h4>
                    {this.state.similarFollowers.map((follower, index) => (
                      <Follower key={index} name={follower} />
                    ))}
                  </div>
                }

              </div>

            </div>
          }

        </div>
      </div>
    );
  }
}

const Repo = (props) => {
  return (
    <div>
      {props.details.name} <a href={props.details.html_url}>Link</a>
    </div>
  );
};

const Follower = (props) => {
  return (
    <div>
      {props.name}
    </div>
  );
};



