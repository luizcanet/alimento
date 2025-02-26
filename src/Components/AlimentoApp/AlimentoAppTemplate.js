const AlimentoAppTemplate = `
    <header>
        <h1>
            <svg
                width="60.020622"
                height="60.020561"
                viewBox="0 0 60.020622 60.020561"
                version="1.1"
                id="svg1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:svg="http://www.w3.org/2000/svg"
                class="alimento-logo">
                <defs
                    id="defs1" />
                <g
                    id="layer1"
                    transform="translate(-74.989738,-148.49998)">
                    <path
                    id="path1"
                    d="m 104.99979,148.49998 -8.344708,14.45338 a 16.689371,16.689371 0 0 0 8.344708,2.23604 16.689371,16.689371 0 0 0 8.3411,-2.24224 z m -13.525787,23.42699 -5.114933,8.85941 a 37.383888,37.383888 0 0 0 18.64072,5.09736 37.383888,37.383888 0 0 0 18.64073,-5.09736 l -5.08755,-8.81186 a 27.112949,27.112949 0 0 1 -13.55318,3.63853 27.112949,27.112949 0 0 1 -13.525787,-3.68608 z m -10.760067,18.63711 -5.724198,9.91516 a 60.020271,60.020271 0 0 0 60.020622,0 l -5.72471,-9.91516 a 48.681919,48.681919 0 0 1 -24.28586,6.61768 48.681919,48.681919 0 0 1 -24.285854,-6.61768 z" />
                </g>
            </svg>
            Alimento
        </h1>
        <nav class="main-menu">
            <ul class="main-menu__items">
                <li class="main-menu__item">
                    <a class="main-menu__item-link" href="/" is="router-anchor" title="Feed">
                        <vector-icon class="main-menu__item-icon" name="home"></vector-icon>
                        <span class="main-menu__item-label">Feed</span>
                    </a>
                </li>
                <li class="main-menu__item">
                    <a class="main-menu__item-link" href="#filters-panel" title="Filters">
                        <vector-icon class="main-menu__item-icon" name="filter"></vector-icon>
                        <span class="main-menu__item-label">Filters</span>
                    </a>
                </li>
                <li class="main-menu__item">
                    <a class="main-menu__item-link" href="/subscriptions" is="router-anchor" title="Subscriptions">
                        <vector-icon class="main-menu__item-icon" name="list"></vector-icon>
                        <span class="main-menu__item-label">Subscriptions</span>
                    </a>
                </li>
                <li class="main-menu__item">
                    <a class="main-menu__item-link" href="#settings-panel" title="Settings">
                        <vector-icon class="main-menu__item-icon" name="gear"></vector-icon>
                        <span class="main-menu__item-label">Settings</span>
                    </a>
                </li>
            </ul>
        </nav>
    </header>
    <add-subscription></add-subscription>
    <main></main>
    <section id="filters-panel" class="panel">
        <filters-panel></filters-panel>
    </section>
    <section id="settings-panel" class="panel">
        <settings-panel></settings-panel>
    </section>
`

export default AlimentoAppTemplate