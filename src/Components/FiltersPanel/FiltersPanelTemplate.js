const FiltersPanelTemplate = self => `
    <hgroup>
        <h2><vector-icon name="filter"></vector-icon> Filters</h2>
        <button class="filters-panel__back-button">
            <vector-icon class="filters-panel__back-button-icon" name="chevron-left"></vector-icon>
            <span class="filters-panel__back-button-label">Back</span>
        </button>
    </hgroup>
    <form class="filters-panel__form">
        <div class="form-field">
            <label class="form-field__label">Feed:</label>
            <select name="feed">
                <option value="" ${(self.feed === '') ? 'selected': ''}>All</option>
            ${self.feeds.map(feed => `
                <option value="${feed.url}" ${(self.feed === feed.url) ? 'selected': ''}>${feed.title}</option>
            `)}
            </select>
        </div>
    </form>
`

export default FiltersPanelTemplate