const SettingsPanelTemplate = data => `
    <hgroup>
        <h2>Settings</h2>
        <button class="settings-panel__back-button">Back</button>
    </hgroup>
    <form class="settings-panel__form">
        <div class="form-field">
            <label class="form-field__label">Updates Interval:</label>
            Every <input
                type="number"
                name="updatesInterval.amount"
                value="${data.updatesInterval.amount}"
                data-as-number required/>
            <select name="updatesInterval.type">
                <option value="m" ${(data.updatesInterval.type === 'm') ? 'selected': ''}>Minutes</option>
                <option value="h" ${(data.updatesInterval.type === 'h') ? 'selected': ''}>Hours</option>
            </select>
        </div>
        <div class="form-field">
            <label><input type="checkbox" name="notifications"
                ${(data.notifications) ? 'checked' : ''}
                ${(Notification.permission === 'denied') ? 'disabled' : ''}
            /> Notifications</label>
        </div>
    </form>
`

export default SettingsPanelTemplate