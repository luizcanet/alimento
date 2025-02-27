import I18n from '../../Internationalization.js'

const i18n = new I18n()

const FeedSubscriptionsTemplate = (data) => `
    <h1>${i18n.t('FeedSubscriptions.title')}</h1>
    ${(data.feeds.length <= 0) ? `<p>${i18n.t('FeedSubscriptions.NoSubscriptionsMessage')}</p>` : ''}
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
                ${i18n.t('FeedSubscriptions.PublicationDate')}: </span>${feed.pubDate.toLocaleString()}</div>` : '' }
            ${(feed.categories.length > 0) ? `<div><span class="feed__label">${i18n.t('FeedSubscriptions.Categories')}: </span>${feed.categories.map(category => `
            <span>
                ${(category.domain) ? `<a href="${category.domain}" target="_blank">` : '' }
                    ${category.name}
                ${(feed.link) ? `</a>` : '' }
            </span>
            `).join(' | ')}</div>` : '' }
        </div>
        <aside class="feed-actions">
            <button class="feed-actions__unsubscribe-button negative" title="${i18n.t('FeedSubscriptions.Unsubscribe')}">
                <vector-icon class="feed-actions__unsubscribe-button-icon" name="xmark"></vector-icon>
                <span class="feed-actions__unsubscribe-button-label">${i18n.t('FeedSubscriptions.Unsubscribe')}</span>
            </button>
        </aside>
    </article>
    `).join('')}
`

export default FeedSubscriptionsTemplate