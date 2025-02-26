const FeedSubscriptionsTemplate = (data) => `
    <h1>Subscriptions</h1>
    ${(data.feeds.length <= 0) ? '<p>No subscriptions yet</p>' : ''}
    ${data.feeds.map(feed => `
    <article class="feed">
        <hgroup>
        ${(feed.image) ? `
            ${(feed.image.link) ? `<a href="${feed.image.link}" class="feed_image_link" target="_blank">` : '' }
                <img src="${feed.image.url}" title="${feed.image.title}" class="feed_image" />
            ${(feed.image.link) ? `</a>` : '' }
        ` : '' }
            <h1><a href="${feed.link}" target="_blank">${feed.title}</a></h1>
            ${(feed.description) ? `<p class="feed_description">${feed.description}</p>` : '' }
        </hgroup>
        <div class="feed-metadata">
            ${(feed.pubDate) ? `<div><span class="feed__label">
                <vector-icon name="clock"></vector-icon>
                Publication Date: </span>${feed.pubDate.toLocaleString()}</div>` : '' }
            ${(feed.categories.length > 0) ? `<div><span class="feed__label">Categories: </span>${feed.categories.map(category => `
            <span>
                ${(category.domain) ? `<a href="${category.domain}" target="_blank">` : '' }
                    ${category.name}
                ${(feed.link) ? `</a>` : '' }
            </span>
            `).join(' | ')}</div>` : '' }
        </div>
        <aside class="feed-actions">
            <button class="feed-actions__unsubscribe-button negative">
                <vector-icon class="feed-actions__unsubscribe-button-icon" name="xmark"></vector-icon>
                <span class="feed-actions__unsubscribe-button-label">Unsubscribe</span>
            </button>
        </aside>
    </article>
    `).join('')}
`

export default FeedSubscriptionsTemplate