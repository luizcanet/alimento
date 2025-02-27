import I18n from '../../Internationalization.js'

const i18n = new I18n()

const SettingsPanelTemplate = data => `
    <hgroup>
        <h2><vector-icon name="gear"></vector-icon> ${i18n.t('SettingsPanel.title')}</h2>
        <button class="settings-panel__back-button">
            <vector-icon class="settings-panel__back-button-icon" name="chevron-left"></vector-icon>
            <span class="settings-panel__back-button-label">${i18n.t('SettingsPanel.Back')}</span>
        </button>
    </hgroup>
    <form class="settings-panel__form">
        <div class="form-field">
            <label class="form-field__label">${i18n.t('SettingsPanel.UpdatesIntervalLabel')}:</label>
            ${i18n.t('SettingsPanel.Every')} <input
                type="number"
                name="updatesInterval.amount"
                value="${data.updatesInterval.amount}"
                data-as-number required/>
            <select name="updatesInterval.type">
                <option value="m" ${(data.updatesInterval.type === 'm') ? 'selected': ''}>${i18n.t('SettingsPanel.Minutes')}</option>
                <option value="h" ${(data.updatesInterval.type === 'h') ? 'selected': ''}>${i18n.t('SettingsPanel.Hours')}</option>
            </select>
        </div>
        <div class="form-field">
            <label><input type="checkbox" name="notifications"
                ${(data.notifications) ? 'checked' : ''}
                ${(Notification.permission === 'denied') ? 'disabled' : ''}
            /> Notifications</label>
        </div>
        <div class="form-field">
            <label class="form-field__label">${i18n.t('SettingsPanel.language.label')}:</label>
            <select name="language">
                <option value="pt-BR" ${(data.language === 'pt-BR') ? 'selected': ''}>${i18n.t('SettingsPanel.language.ptBR')}</option>
                <option value="en" ${(data.language === 'en') ? 'selected': ''}>${i18n.t('SettingsPanel.language.en')}</option>
            </select>
        </div>
    </form>
`

export default SettingsPanelTemplate