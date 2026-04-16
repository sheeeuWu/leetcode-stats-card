const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql'

const STATS_QUERY = `
  query getUserStats($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        reputation
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        streak
        totalActiveDays
      }
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
    }
  }
`

function sanitizeUsername(username) {
  // Only allow alphanumeric, hyphens, underscores
  return username?.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) ?? ''
}

function parseStats(data) {
  const user     = data?.data?.matchedUser
  const contest  = data?.data?.userContestRanking
  const calendar = user?.userCalendar

  if (!user) throw new Error('User not found')

  // Parse easy/medium/hard/total
  const submissions = user.submitStatsGlobal?.acSubmissionNum ?? []
  let easy = 0, medium = 0, hard = 0, totalSolved = 0

  submissions.forEach(s => {
    if (s.difficulty === 'Easy')   easy   = s.count
    if (s.difficulty === 'Medium') medium = s.count
    if (s.difficulty === 'Hard')   hard   = s.count
    if (s.difficulty === 'All')    totalSolved  = s.count
  })

  return {
    username:       user.username,
    platformRank:   user.profile?.ranking      ?? null,
    reputation:     user.profile?.reputation   ?? 0,
    easy,
    medium,
    hard,
    totalSolved,
    streak:         calendar?.streak           ?? 0,
    totalActiveDays:calendar?.totalActiveDays  ?? 0,
    contestRating:  contest?.rating
                      ? Math.round(contest.rating)
                      : null,
    globalRank:    contest?.globalRanking     ?? null,
  }
}

// leetcode API  
export async function fetchStats(rawUsername) {
  const username = sanitizeUsername(rawUsername)

  if (!username) {
    throw new Error('Invalid username')
  }

  const response = await fetch(LEETCODE_GRAPHQL, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      // Required — LeetCode blocks requests without a referer
      'Referer':      'https://leetcode.com',
    },
    body: JSON.stringify({
      query:     STATS_QUERY,
      variables: { username },
    }),
  })

  if (!response.ok) {
    throw new Error(`LeetCode API responded with status ${response.status}`)
  }

  const data = await response.json()
  // console.log("data ---> ", data);

  // LeetCode returns 200 even for errors, check data level
  if (data.errors) {
    throw new Error(data.errors[0]?.message ?? 'GraphQL error')
  }

  return parseStats(data)
}