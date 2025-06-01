# Stremio IMDb Episode Ratings Add-on

A lightweight self-hosted Stremio add-on that displays IMDb ratings for TV show episodes as informational streams.

![Stremio Add-on](https://img.shields.io/badge/Stremio-Add--on-purple) ![Node.js](https://img.shields.io/badge/Node.js-16+-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- 📺 **Episode-specific IMDb ratings** for TV shows
- ⭐ **Displays rating and vote count** in a clean format
- 🔗 **Links to IMDb page** when clicked
- 🚀 **Lightweight and fast** - single file implementation
- 🏠 **Perfect for self-hosting** - no external dependencies except OMDb API

## How It Works

The add-on appears as an informational stream in your sources list showing:
```
───────────────
⭐ IMDb        : 8.5/10 (12,345 votes)
───────────────
```

## Installation

### Prerequisites
- Node.js 16+ installed
- Free OMDb API key from [OMDb API](http://www.omdbapi.com/apikey.aspx)

### Setup

1. **Clone this repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/stremio-imdb-ratings.git
   cd stremio-imdb-ratings
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get your OMDb API key:**
   - Go to [OMDb API](http://www.omdbapi.com/apikey.aspx)
   - Sign up for a free account (1,000 requests/day)
   - Copy your API key

4. **Update the API key:**
   - Open `index.js`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key on line 32:
   ```javascript
   const apiKey = process.env.OMDB_API_KEY || 'YOUR_API_KEY_HERE';
   ```

5. **Start the add-on:**
   ```bash
   npm start
   ```

6. **Install in Stremio:**
   - Open Stremio
   - Go to Add-ons → Community Add-ons (puzzle piece icon)
   - Click "+" to add from URL
   - Enter: `http://localhost:3000/manifest.json`
   - Click "Install"

## Usage

1. Browse to any TV series in Stremio
2. Click on an episode
3. Look for "📊 IMDb Rating" in your streams/sources list
4. The rating will appear alongside your other streaming sources

## Configuration

### Environment Variables
You can set your API key as an environment variable instead of hardcoding it:

```bash
export OMDB_API_KEY="your_api_key_here"
npm start
```

### Port Configuration
By default, the add-on runs on port 3000. To change it:

```bash
PORT=8080 npm start
```

## API Limits

- **Free OMDb tier**: 1,000 requests per day
- **Perfect for personal use**: You won't hit the limit with normal viewing
- **For heavy usage**: Consider upgrading to a paid OMDb plan

## Deployment

For public deployment, you can use:
- **Heroku** (free tier)
- **Railway**
- **Vercel**
- **Your own VPS**

Make sure to set your OMDb API key as an environment variable in production!

## Troubleshooting

**Add-on not showing ratings?**
- Check your OMDb API key is valid
- Ensure you're viewing TV series (not movies)
- Check console logs for errors

**"No handler for series" error?**
- Restart the add-on server
- Reinstall the add-on in Stremio

**Ratings not loading?**
- Some episodes might not have IMDb ratings yet
- Very new episodes often lack rating data

## Contributing

Feel free to fork this repository and submit pull requests! Some ideas for improvements:

- Add more rating sources (TMDb, Metacritic)
- Implement caching for better performance
- Add movie support
- Better error handling

## License

MIT License - feel free to use and modify as you wish!

## Acknowledgments

- Built with [Stremio Add-on SDK](https://github.com/Stremio/stremio-addon-sdk)
- Ratings data from [OMDb API](http://www.omdbapi.com/)
- Inspired by [Rating Aggregator](https://github.com/anmol210202/rating-aggregator-)

---

**Made for the Stremio community** 🎬 **Perfect for self-hosting** 🏠