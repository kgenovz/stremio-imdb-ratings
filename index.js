const { addonBuilder } = require('stremio-addon-sdk');
const https = require('https');

// Add-on manifest
const manifest = {
    id: 'imdb.episode.ratings.streams',
    version: '1.0.0',
    name: 'IMDb Episode Ratings',
    description: 'Shows IMDb ratings for TV show episodes as informational streams',
    resources: ['stream'],
    types: ['series'],
    catalogs: [],
    idPrefixes: ['tt'] // IMDb ID prefix
};

const builder = new addonBuilder(manifest);

// Helper function to make HTTPS requests
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

// Get IMDb rating for a specific episode
async function getEpisodeRating(imdbId, season, episode) {
    try {
        const apiKey = process.env.OMDB_API_KEY || '4dd7471d';
        const url = `https://www.omdbapi.com/?i=${imdbId}&Season=${season}&Episode=${episode}&apikey=${apiKey}`;
        
        console.log(`🔗 Fetching episode ${season}x${episode} rating:`, url);
        const data = await makeRequest(url);
        console.log('📊 OMDb response:', data);
        
        if (data && data.imdbRating && data.imdbRating !== 'N/A') {
            return {
                rating: data.imdbRating,
                votes: data.imdbVotes || '',
                title: data.Title || '',
                plot: data.Plot || ''
            };
        }
        console.log('⚠️ No rating found in response');
        return null;
    } catch (error) {
        console.error('💥 Error fetching episode rating:', error);
        return null;
    }
}

// Get series episodes with ratings
async function getSeriesEpisodes(seriesImdbId, season) {
    try {
        const apiKey = process.env.OMDB_API_KEY || 'YOUR_API_KEY_HERE';
        const url = `https://www.omdbapi.com/?i=${seriesImdbId}&Season=${season}&apikey=${apiKey}`;
        
        console.log('🔗 Fetching series episodes:', url);
        const data = await makeRequest(url);
        console.log('📺 Series episodes response:', data);
        
        if (data && data.Episodes) {
            return data.Episodes.map(ep => ({
                episode: parseInt(ep.Episode),
                title: ep.Title,
                rating: ep.imdbRating !== 'N/A' ? ep.imdbRating : null,
                votes: ep.imdbVotes || '',
                imdbId: ep.imdbID,
                plot: ep.Plot || ''
            }));
        }
        console.log('⚠️ No episodes found in response');
        return [];
    } catch (error) {
        console.error('💥 Error fetching series episodes:', error);
        return [];
    }
}

// Stream handler
builder.defineStreamHandler(async (args) => {
    try {
        console.log('🎬 Stream request received:', args);
        const { type, id } = args;
        
        if (type !== 'series') {
            return { streams: [] };
        }
        
        // Parse the ID to extract IMDb ID, season, and episode
        // Expected format: tt1234567:1:1 (imdbId:season:episode)
        const [imdbId, season, episode] = id.split(':');
        
        if (!imdbId || !season || !episode) {
            console.log('❌ Invalid ID format:', id);
            return { streams: [] };
        }
        
        console.log(`📺 Processing episode ${season}x${episode} for series ${imdbId}`);
        
        // Get rating for this specific episode
        const ratingData = await getEpisodeRating(imdbId, season, episode);
        
        const streams = [];
        
        if (ratingData) {
            // Create informational stream using the working format from ratings aggregator
            const votesText = ratingData.votes ? ` (${ratingData.votes} votes)` : '';
            
            // Clean format - just the rating info
            const formattedLines = [
                "───────────────",
                `⭐ IMDb        : ${ratingData.rating}/10${votesText}`,
                "───────────────"
            ];
            
            const stream = {
                name: "📊 IMDb Rating",
                description: formattedLines.join('\n'),
                externalUrl: `https://www.imdb.com/title/${imdbId}/`,
                behaviorHints: {
                    notWebReady: true,
                    bingeGroup: `ratings-${id}`
                },
                type: "other"
            };
            
            streams.push(stream);
            console.log(`✅ Added rating stream: ${stream.name}`);
        } else {
            // Try to get rating from series season data as fallback
            console.log('🔄 Trying season-based lookup as fallback...');
            const episodeList = await getSeriesEpisodes(imdbId, season);
            const episodeData = episodeList.find(ep => ep.episode === parseInt(episode));
            
            if (episodeData && episodeData.rating) {
                const votesText = episodeData.votes ? ` (${episodeData.votes} votes)` : '';
                
                const formattedLines = [
                    "───────────────",
                    `⭐ IMDb        : ${episodeData.rating}/10${votesText}`,
                    "───────────────"
                ];
                
                const stream = {
                    name: "📊 IMDb Rating",
                    description: formattedLines.join('\n'),
                    externalUrl: `https://www.imdb.com/title/${imdbId}/`,
                    behaviorHints: {
                        notWebReady: true,
                        bingeGroup: `ratings-${id}`
                    },
                    type: "other"
                };
                
                streams.push(stream);
                console.log(`✅ Added rating stream (fallback): ${stream.name}`);
            } else {
                // No rating available
                streams.push({
                    name: "📊 IMDb Rating",
                    description: "───────────────\n⭐ IMDb Rating: Not Available\n───────────────",
                    externalUrl: `https://www.imdb.com/title/${imdbId}/`,
                    behaviorHints: {
                        notWebReady: true,
                        bingeGroup: `ratings-${id}`
                    },
                    type: "other"
                });
                console.log('❌ Added "no rating" stream');
            }
        }
        
        console.log(`📤 Returning ${streams.length} streams:`, JSON.stringify(streams, null, 2));
        return { streams };
        
    } catch (error) {
        console.error('💥 Stream handler error:', error);
        return { streams: [] };
    }
});

// Export the add-on
module.exports = builder.getInterface();

// If running directly (for testing)
if (require.main === module) {
    const { serveHTTP } = require('stremio-addon-sdk');
    const port = process.env.PORT || 3000;
    
    serveHTTP(builder.getInterface(), { port });
}