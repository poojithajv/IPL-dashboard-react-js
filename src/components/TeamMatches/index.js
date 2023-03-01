// Write your code here
import {Component} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

class TeamMatches extends Component {
  state = {
    teamMatchesData: {},
    isLoading: true,
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  updateLatestMatchDetails = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const data = await response.json()
    const updatedData = {
      teamBannerUrl: data.team_banner_url,
      latestMatchDetails: this.updateLatestMatchDetails(
        data.latest_match_details,
      ),
      recentMatches: data.recent_matches.map(eachMatch =>
        this.updateLatestMatchDetails(eachMatch),
      ),
    }
    this.setState({teamMatchesData: updatedData, isLoading: false})
  }

  render() {
    const {teamMatchesData, isLoading} = this.state
    const {teamBannerUrl, latestMatchDetails, recentMatches} = teamMatchesData
    const {match} = this.props
    const {params} = match
    const {id} = params
    return isLoading ? (
      <div testid="loader" className="spinner">
        <Loader type="Oval" color="#ffffff" height={50} width={50} />
      </div>
    ) : (
      <div className={`team-match-container ${id}`}>
        <div className="team-matches-container">
          <img className="team-banner" src={teamBannerUrl} alt="team banner" />
          <LatestMatch
            latestMatchData={latestMatchDetails}
            key={latestMatchDetails.id}
          />
          <ul className="match-cards">
            {recentMatches.map(eachMatch => (
              <MatchCard key={eachMatch.id} matchDetails={eachMatch} />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
export default TeamMatches
