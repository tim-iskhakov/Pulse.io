export type CoinDetailsNumberMap = Record<string, number>
export type CoinDetailsStringMap = Record<string, string>

export interface CoinDetailsResponse {
  id: string
  symbol: string
  name: string
  web_slug: string
  asset_platform_id: string | null
  platforms: Record<string, string>
  detail_platforms: Record<
    string,
    {
      decimal_place: number | null
      contract_address: string
    }
  >
  block_time_in_minutes: number
  hashing_algorithm: string | null
  categories: string[]
  preview_listing: boolean
  public_notice: string | null
  additional_notices: string[]
  localization: CoinDetailsStringMap
  description: CoinDetailsStringMap
  links: {
    homepage: string[]
    whitepaper: string
    blockchain_site: string[]
    official_forum_url: string[]
    chat_url: string[]
    announcement_url: string[]
    snapshot_url: string | null
    twitter_screen_name: string
    facebook_username: string
    bitcointalk_thread_identifier: string | number | null
    telegram_channel_identifier: string
    subreddit_url: string
    repos_url: {
      github: string[]
      bitbucket: string[]
    }
  }
  image: {
    thumb: string
    small: string
    large: string
  }
  country_origin: string
  genesis_date: string | null
  sentiment_votes_up_percentage: number | null
  sentiment_votes_down_percentage: number | null
  watchlist_portfolio_users: number | null
  market_cap_rank: number | null
  market_cap_rank_with_rehypothecated: number | null
  market_data: {
    current_price: CoinDetailsNumberMap
    total_value_locked: number | null
    mcap_to_tvl_ratio: number | null
    fdv_to_tvl_ratio: number | null
    roi: unknown | null
    ath: CoinDetailsNumberMap
    ath_change_percentage: CoinDetailsNumberMap
    ath_date: CoinDetailsStringMap
    atl: CoinDetailsNumberMap
    atl_change_percentage: CoinDetailsNumberMap
    atl_date: CoinDetailsStringMap
    market_cap: CoinDetailsNumberMap
    market_cap_rank: number | null
    outstanding_token_value_usd: number | null
    market_cap_rank_with_rehypothecated: number | null
    fully_diluted_valuation: CoinDetailsNumberMap
    market_cap_fdv_ratio: number | null
    total_volume: CoinDetailsNumberMap
    high_24h: CoinDetailsNumberMap
    low_24h: CoinDetailsNumberMap
    price_change_24h: number | null
    price_change_percentage_24h: number | null
    price_change_percentage_7d: number | null
    price_change_percentage_14d: number | null
    price_change_percentage_30d: number | null
    price_change_percentage_60d: number | null
    price_change_percentage_200d: number | null
    price_change_percentage_1y: number | null
    market_cap_change_24h: number | null
    market_cap_change_percentage_24h: number | null
    price_change_24h_in_currency: CoinDetailsNumberMap
    price_change_percentage_1h_in_currency: CoinDetailsNumberMap
    price_change_percentage_24h_in_currency: CoinDetailsNumberMap
    price_change_percentage_7d_in_currency: CoinDetailsNumberMap
    price_change_percentage_14d_in_currency: CoinDetailsNumberMap
    price_change_percentage_30d_in_currency: CoinDetailsNumberMap
    price_change_percentage_60d_in_currency: CoinDetailsNumberMap
    price_change_percentage_200d_in_currency: CoinDetailsNumberMap
    price_change_percentage_1y_in_currency: CoinDetailsNumberMap
    market_cap_change_24h_in_currency: CoinDetailsNumberMap
    market_cap_change_percentage_24h_in_currency: CoinDetailsNumberMap
    total_supply: number | null
    max_supply: number | null
    circulating_supply: number | null
    outstanding_supply: number | null
    last_updated: string
  }
  community_data: {
    facebook_likes: number | null
    reddit_average_posts_48h: number | null
    reddit_average_comments_48h: number | null
    reddit_subscribers: number | null
    reddit_accounts_active_48h: number | null
    telegram_channel_user_count: number | null
  }
  developer_data: {
    forks: number | null
    stars: number | null
    subscribers: number | null
    total_issues: number | null
    closed_issues: number | null
    pull_requests_merged: number | null
    pull_request_contributors: number | null
    code_additions_deletions_4_weeks: {
      additions: number | null
      deletions: number | null
    }
    commit_count_4_weeks: number | null
    last_4_weeks_commit_activity_series: number[]
  }
  status_updates: unknown[]
  last_updated: string
  tickers: Array<{
    base: string
    target: string
    market: {
      name: string
      identifier: string
      has_trading_incentive: boolean
    }
    last: number | null
    volume: number | null
    converted_last: CoinDetailsNumberMap
    converted_volume: CoinDetailsNumberMap
    trust_score: string | null
    bid_ask_spread_percentage: number | null
    timestamp: string | null
    last_traded_at: string | null
    last_fetch_at: string | null
    is_anomaly: boolean
    is_stale: boolean
    trade_url: string | null
    token_info_url: string | null
    coin_id: string
    target_coin_id: string | null
  }>
}
