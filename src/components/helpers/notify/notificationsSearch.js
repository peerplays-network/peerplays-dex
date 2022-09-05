import React, {Component} from 'react'
import IconSearch from "../../../svg/search.svg";
import SearchForm from "../form/searchForm";

class NotificationsSearch extends Component {

    state = {
        open: false
    };

    openSearch = () => this.changeSearch(true);
    closeSearch = () => this.changeSearch(false);

    changeSearch = open => this.setState({open});

    render(){
        return(
            <div className={`notify__search-wrapper${this.state.open ? ' open' : ''}`}>
                <button onClick={this.openSearch}><IconSearch /></button>
                <div className="notify__search-field">
                    <SearchForm
                        handleChange={this.props.handleSearch}
                        handleClose={this.closeSearch}
                        placeholderTag="layout.notificationsSearch"
                    />
                </div>
            </div>
        )
    }
}

export default NotificationsSearch;