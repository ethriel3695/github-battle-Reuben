import axios from 'axios';

const id = "YOUR_CLIENT_ID";
const sec = "YOUR_SECRET_ID";
const params = "?client_id=" + id + "&client_secret=" + sec;

async function getProfile (username = 'ethriel3695') {
    try {
     const user = await axios.get(`https://api.github.com/users/${username}${params}`)
        return user.data;
    } catch (error) {
        console.log(`Error in player data ${error}`);
    }
}

function getRepos (username = 'ethriel3695') {
    return axios
    .get(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
}

function getStarCount ({data}) {
    return data.reduce((count, repo) => {
        return count + repo.stargazers_count;
    }, 0);
}

function calculateScore (profile, repos) {
    var followers = profile.followers;
    var totalStars = getStarCount(repos);

    return (followers * 3) + totalStars;
}

function handleError (error) {
    console.warn(error);
    return null;
}

async function getUserData(player) {
    try {
        const data = await axios.all([getProfile(player), getRepos(player)]);
        const profile = data[0];
        const repos = data[1];

        return {
            profile: profile,
            score: calculateScore(profile, repos)
        }
    } catch (error) {
        console.log(`This is an error with user data: ${error}`);
    }
}

function sortPlayers (players) {
    return players.sort((a,b) => {
        return b.score - a.score;
    });
}

export function battle (players) {
    return axios.all(players.map(getUserData))
    .then(sortPlayers)
    .catch(handleError)
}
export async function fetchPopularRepos (language) {
    const encodedURI = window.encodeURI
    (`https://api.github.com/search/repositories?q=stars:>1+
language:${language}&sort=stars&order=desc&type=Repositories`);
    const response = await axios.get(encodedURI)
        return response.data.items;
}