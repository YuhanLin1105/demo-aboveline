import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import registerServiceWorker from './registerServiceWorker';


class DemoAPI {
    constructor() {
        this.baseURL = "https://demo8802304.mockable.io"
    }

    fetchUsers() {
        return fetch(`${this.baseURL}/users`)
            .then(res => res.json())
    }

}

const fetchInstance = new DemoAPI();


class MainSection extends React.Component {
    render() {
        const { data } = this.props;

        const listNodes = data
            ? this.props.data.map(item => (
                <div key={item.id}>
                    <p>
                        firstName: {item.first_name} , lastName:{item.last_name}
                    </p>
                </div>
            ))
            : null

        return (
            <section>
                {listNodes}
            </section>
        )
    }
}

class SearchBar extends React.Component {
    render() {
        const { query, onChange } = this.props

        return (
            <div>
                <input type="search"
                    value={query}
                    onChange={(e) => { onChange(e) }} />
            </div>
        )
    }
}


class Header extends React.Component {
    render() {
        return (
            <header>
                HEADER
                <SearchBar {...this.props} />
            </header>
        )
    }

}

class Loadmore extends React.Component {
    componentDidMount() {
        console.log(this.el);
        const {el} = this;
        const {onClick} = this.props;
        function callback() {
            const top = el.getBoundingClientRect().top;
            const windowHeight = window.screen.height;
            if (top && top < windowHeight) {
                onClick()
            }
        }

        let timeAction;
        window.addEventListener("scroll", () => {
            if (timeAction) {
                clearTimeout(timeAction);
            }

            timeAction = setTimeout(() => { callback()}, 1000)
        })
    }

    render() {
        return (
            <div ref={el => { this.el = el }}>
                <span {...this.props}>
                    Loadmore
                </span>
            </div>
        )
    }

}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            data: null,
            filterData: null,
            renderData: null,
            renderNumber: 10,
            loadStartIndex: 0,
            dataLength: 0
        }
        this.handlerUpdateQuery = this.handlerUpdateQuery.bind(this);
        this.handlerLoadmore = this.handlerLoadmore.bind(this);
    }

    handlerFilterData() {

    }

    handlerLoadmore() {

        const { loadStartIndex, renderNumber, dataLength, renderData, data } = this.state;
        const loadEndIndex = (loadStartIndex + renderNumber > dataLength - 1)
            ? dataLength - 1
            : loadStartIndex + renderNumber
        let i;
        const updateRenderData = [...renderData];
        for (i = loadStartIndex; i < loadEndIndex; i++) {
            updateRenderData.push(data[i]);
        }

        this.setState({
            loadStartIndex: loadEndIndex,
            renderData: updateRenderData
        })
    }

    componentDidMount() {
        fetchInstance.fetchUsers()
            .then(res => {
                console.log(res);
                const renderData = [];
                let i;
                for (i = 0; i < this.state.renderNumber; i++) {
                    renderData.push(res[i])
                }

                this.setState({
                    dataLength: res.length,
                    data: res,
                    renderData: renderData,
                    loadStartIndex: this.state.renderNumber
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handlerUpdateQuery(e) {
        const { data, query } = this.state;
        const filterData = data.filter(item => {
            if (item.first_name.includes(query)) {
                return true
            } else {
                return false
            }
        })

        this.setState({
            query: e.target.value,
            filterData: filterData,
        })
    }

    render() {
        const { query, data, filterData, renderData } = this.state;

        const searchConfig = {
            query: query,
            onChange: this.handlerUpdateQuery
        }

        return (
            <div>
                <Header {...searchConfig} />
                <main>
                    <MainSection data={renderData} />
                    <Loadmore onClick={this.handlerLoadmore} />
                </main>
            </div>
        )
    }
}



ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
