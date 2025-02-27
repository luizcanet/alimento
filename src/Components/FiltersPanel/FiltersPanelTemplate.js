import I18n from '../../Internationalization.js'

const i18n = new I18n()

const FiltersPanelTemplate = self => `
    <hgroup>
        <h2><vector-icon name="filter"></vector-icon> ${i18n.t('FiltersPanel.title')}</h2>
        <button class="filters-panel__back-button">
            <vector-icon class="filters-panel__back-button-icon" name="chevron-left"></vector-icon>
            <span class="filters-panel__back-button-label">${i18n.t('FiltersPanel.Back')}</span>
        </button>
    </hgroup>
    <form class="filters-panel__form">
        <div class="form-field">
            <label class="form-field__label">${i18n.t('FiltersPanel.FeedLabel')}:</label>
            <select name="feed">
                <option value="" ${(self.feed === '') ? 'selected': ''}>${i18n.t('FiltersPanel.All')}</option>
            ${self.feeds.map(feed => `
                <option value="${feed.url}" ${(self.feed === feed.url) ? 'selected': ''}>${feed.title}</option>
            `)}
            </select>
        </div>
    </form>
`

export default FiltersPanelTemplate