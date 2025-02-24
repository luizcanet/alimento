const FeedItemsListTemplate = data => `
${(data.feedItems.length <= 0) ? '<p>No updates yet</p>' : ''}
${data.feedItems.map(feedItem => `
    <article class="feed-item">
        ${(feedItem.link) ? `<a href="${feedItem.link}" target="_blank"  class="feed-item__link">` : '' }
            ${(feedItem.new) ? `<span class="feed-item__new">New</span>` : ''}
            ${(feedItem.title) ? `<h1 class="feed-item__title">${feedItem.title}</h1>` : ''}
            ${(feedItem.description) ? `<div class="feed-item__description">${feedItem.description}</div>` : ''}
        ${(feedItem.link) ? `</a>` : '' }
        <footer class="feed-item__footer">
            ${(feedItem.pubDate) ? `<div><span class="feed-item__label">Date: </span>${feedItem.pubDate.toLocaleString()}</div>` : '' }
            ${(feedItem.categories.length > 0) ? `<div><span class="feed-item__label">Categories: </span>${feedItem.categories.map(category => `
            <span>
                ${(category.domain) ? `<a href="${category.domain}" target="_blank">` : '' }
                    ${category.name}
                ${(feedItem.link) ? `</a>` : '' }
            </span>
            `).join(' | ')}</div>` : '' }
            ${(feedItem.comments) ? `<div><a href="${feedItem.comments}" target="_blank">Comments</a></div>` : '' }
        </footer>
    </article>
`).join('')}`

export default FeedItemsListTemplate