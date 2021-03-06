import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-selector/iron-selector.js';
import '@kano/kwc-style/typography.js';

import { assetsIcon, checkIcon } from './assets.js';

/**
 * `kwc-picker`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class KwcPicker extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    width: 169.22px;
                    padding: 8px 8px 0;
                    border-radius: 5px;
                    background: #292F35;
                    display: inline-flex;
                    flex-direction: column;
                    
                    font-family: var(--font-body);
                    font-size: 13px;
                    font-weight: bold;
                    letter-spacing: 0.2px;

                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                .header {
                    padding-top: 5.5px;
                }
                .top {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .top svg {
                    width: 10.2px;
                    position: relative;
                    top: -0.7px;
                }
                .top .icon {
                    width: 16px;
                    height: 16px;
                }
                .top p {
                    color: #9FA4A8;
                    margin: 0;
                    margin-left: 4px;
                }
                .top,
                .content {
                    color: #FFF;
                }
                .search {
                    padding-top: 9.5px;
                }
                .search input,
                .search input::placeholder {
                    color: #FFF;
                    font-weight: bold;
                }
                .search input {
                    width: 100%;
                    height: 30.25px;
                    border: none;
                    border-radius: 4px;
                    padding: 0 4px 0 12px;
                    background: #414A51;
                }
                .search input:focus {
                    outline: none;
                }
                .search input::-webkit-search-cancel-button {
                    -webkit-appearance: none;
                    height: 13.41px;
                    width: 13.41px;
                    border-radius: 10px;
                    background: url(/assets/search.svg);
                    background-repeat: no-repeat;
                }
                .search input::-webkit-search-cancel-button:hover {
                    cursor: pointer;
                }
                .content {
                    height: 240px;
                    overflow: auto;
                    margin-top: 9.5px;
                }
                .item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 8px 0;
                    height: 32px;
                }
                .item:first-child{
                    margin-top: 0;
                }
                .item:hover {
                    cursor: pointer;
                }
                .item .image {
                    width: 32px;
                    height: 32px;
                    background: #414A51;
                    border-radius: 4px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .item .image[hidden] {
                    display: none;
                }
                .item .check {
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                }
                .item .check svg {
                    width: 100%;
                    height: 100%;
                    fill: #FFF;
                }
                .item iron-image {
                    width: 24px;
                    height: 24px;
                }
                .item span {
                    color: #9FA4A8;
                    margin-left: 10px;
                    transition: all 0.2s ease;
                    flex: 1;
                }
                .item:hover span {
                    color: #FFF;
                }
                .item.iron-selected .image {
                    background: #5E6367;
                }
                .item.iron-selected span {
                    color: #FFF;
                }
                .content::-webkit-scrollbar {
                    width: 5.25px;
                }
                .content::-webkit-scrollbar-track,
                .content::-webkit-scrollbar-thumb {
                    border-radius: 8px;
                }
                .content::-webkit-scrollbar-track {
                    background: #414A51;
                    margin: 9.5px 0 8px;
                }
                .content::-webkit-scrollbar-thumb {
                    background: #22272D;
                }
                .content::-webkit-scrollbar-thumb:hover {
                    cursor: pointer;
                }
            </style>
            <div class="header">
                <div class="top">
                    <template is="dom-if" if="[[!icon]]">
                        ${assetsIcon}
                    </template>
                    <template is="dom-if" if="[[icon]]">
                        <iron-image class="icon" src="[[icon]]" sizing="contain"></iron-image>
                    </template>
                    <p>[[name]]</p>
                </div>
                <div class="search" hidden$="[[!filter]]">
                    <input
                        type="search"
                        placeholder="Search"
                        value="{{_search::input}}">
                </div>
            </div>
            <div class="content">
                <iron-selector selected="{{selectedIndex}}" attr-for-selected="id">
                    <template is="dom-repeat" items="[[_items]]" filter="[[_filter(_search)]]" id="list">
                        <div class="item" id\$="[[item.key]]">
                            <div class="image" hidden$="[[!item.img]]">
                                <iron-image src="[[item.img]]" sizing="contain"></iron-image>
                            </div>
                            <span>[[item.label]]</span>
                            <div class="check" hidden$="[[isCheckHidden(item.key, selectedIndex)]]">
                                ${checkIcon}
                            </div>
                        </div>
                    </template>
                </iron-selector>
            </div>
        `;
    }
    static get properties() {
        return {
            name: {
                type: String,
                value: 'Assets',
            },
            items: {
                type: Array,
                value: [],
            },
            filter: {
                type: Boolean,
                value: false,
            },
            _search: {
                type: String,
                notify: true,
                value: '',
            },
            filterOn: {
                type: String,
                value: 'label',
            },
            selectedIndex: {
                type: String,
            },
            selected: {
                type: Object,
                notify: true,
                computed: '_computeSelected(selectedIndex)',
            },
            _items: {
                computed: '_computeItems(items.splices)',
            },
            icon: {
                type: String,
                value: null,
            }
        };
    }
    scrollToSelected() {
        if (this.selectedIndex !== undefined) {
            this.shadowRoot.getElementById(this.selectedIndex).scrollIntoView({block: "center", behavior: "smooth"});
        }
    }
    _computeSelected(index) {
        return this.items ? this.items[index] : null;
    }
    _computeItems() {
        return this.items.map((item, index) => Object.assign({ key: index }, item));
    }
    _filter(search) {
        if (this.items) {
            if (!search) {
                return null;
            }
            return (item) => {
                const label = item[this.filterOn].toLowerCase();
                return label.includes(search.toLowerCase());
            };
        }
    }
    isCheckHidden(key, index) {
        return key != index;
    }
}

window.customElements.define('kwc-picker', KwcPicker);
