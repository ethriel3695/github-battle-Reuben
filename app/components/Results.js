import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { battle } from '../utils/api';
import PlayerPreview from './PlayerPreview';
import Loading from './Loading';

function Profile (props) {
   const { avatar_url, login, name, location, company, followers
       , following, public_repos, blog } = props.info;

    return (
        <PlayerPreview avatar={avatar_url} username={login}>
            <ul className='space-list-items'>
                {name && <li>{name}</li>}
                {location && <li>{location}</li>}
                {company && <li>{company}</li>}
                <li>Followers: {followers}</li>
                <li>Following: {following}</li>
                <li>Public Repos: {public_repos}</li>
                {blog && <li><a href={blog}>{blog}</a></li>}
            </ul>
        </PlayerPreview>
    )
}

Profile.propTypes = {
    info: PropTypes.object.isRequired,
}

function Player ({label, score, profile}) {
    return (
        <div>
            <h1 className='header'>{label}</h1>
            <h3 style={{textAlign: 'center'}}>Score: {score}</h3>
            <Profile info={profile}/>
        </div>
    )
} 

Player.propTypes = {
    label: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    profile: PropTypes.object.isRequired
}

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            winner: null,
            loser: null,
            error: null,
            loading: true
        }
    }
    componentDidMount () {
        const players = queryString.parse(this.props.location.search);
        battle([
            players.playerOneName,
            players.playerTwoName
        ]).then((results) => {
            if (results === null) {
                return this.setState(function () {
                    return {
                        error: 'Looks like there was an error. Check that both users exist' +
                        'on Github',
                        loading: false,
                    }
                });
            }

            this.setState(function() {
                return {
                    error: null,
                    winner: results[0],
                    loser: results[1],
                    loading: false
                }
            })
        });
    }
    render() {
        let error = this.state.error;
        let winner = this.state.winner;
        let loser = this.state.loser;
        let loading = this.state.loading;

        if (loading === true) {
            return <Loading />
        }

        if (error) {
            return (
                <div>
                    <p>error</p>
                    <Link to='/battle'>Reset</Link>
                </div>
            )
        }
        
        return (
            <div className='row'>
                <Player
                    label='Winner'
                    score={winner.score}
                    profile={winner.profile}
                />
                <Player
                    label='Loser'
                    score={loser.score}
                    profile={loser.profile}
                />
            </div>
        )
    }
}

export default Results;