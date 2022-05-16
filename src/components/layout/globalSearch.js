import React, {Component} from 'react';
import {connect} from "react-redux";
import SearchForm from "../helpers/form/searchForm";
import Translate from "react-translate-component";
import Dropdown from "../helpers/form/dropdown";
import SelectHeader from "../helpers/selectHeader";
import {blockContent} from "../../actions/blockContent";
import {clearLayout} from "../../dispatch/layoutDispatch";
import {searchFuncs} from "../../actions/forms/globalSearch";

const searchTypes = ['users', 'blocks', 'tokens'];

class GlobalSearch extends Component{
    state = {
        searchType: searchTypes[0],
        value: '',
        result: []
    };

    componentWillReceiveProps(nextProps){
        this.setState({searchType:searchTypes[0]})
        if(this.props.open === nextProps.open) return;
        blockContent(nextProps.open);
        this.setState({result:[],value:''})
    }

    changeSearchType = searchType => this.getResult(searchType, this.state.value);
    handleSearch = value => this.getResult(this.state.searchType, value.trim());
    getResult = (searchType, value) => {
        if(!value) return this.setState({result: [], value, searchType});
        searchFuncs[searchType](value).then(result => this.setState({searchType, result, value}));
    };

    render(){
        return(
            <div className={`global-search${this.props.open ? ' open' : ''}`}>
                <div className="global-search__form">
                    <SearchForm
                        handleChange={this.handleSearch}
                        handleClose={clearLayout}
                        placeholderTag="layout.searchPlaceholder"
                    />
                </div>
                <div className="global-search__filter">
                    <Dropdown
                        btn={<SelectHeader text={<Translate content={`search.${this.state.searchType}`}/>}/>}
                        list={searchTypes.map((searchType, id) => {
                                if (this.state.searchType !== searchType)
                                    return <Translate
                                        key={id}
                                        component="button"
                                        content={`search.${searchType}`}
                                        onClick={() => this.changeSearchType(searchType)}
                                    />
                            }
                        )}
                    />
                </div>
                <div className="global-search__result custom-scroll">
                    { this.state.result }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({open: state.layout.globalSearch});

export default connect(mapStateToProps)(GlobalSearch);
